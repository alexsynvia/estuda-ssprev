// Importa um caderno de questões do Instituto Mais (PDF em 2 colunas) + gabarito -> JSON para o app.
// Usa pdfjs-dist para ler o texto COM coordenadas: a separação das colunas é feita pela posição x real, não por espaços.
// Uso: node scripts/import-prova-pdf.js <prova.pdf> <GABARITO(ex: AEDEA...)> <saida.json> --id=... --orgao="..." --ano=2025 --nivel=Superior --cargo="..." [--alts=5] [--fonte="..."] [--debug]
const fs = require('fs');

const [pdf, gab, saida, ...flags] = process.argv.slice(2);
if (!pdf || !gab || !saida) { console.error('uso: node import-prova-pdf.js prova.pdf GABARITO saida.json --id= --orgao= --ano= --nivel= --cargo='); process.exit(1); }
const opt = Object.fromEntries(flags.map((f) => { const m = /^--([^=]+)=(.*)$/.exec(f); return m ? [m[1], m[2]] : [f.replace(/^--/, ''), true]; }));
const NALT = Number(opt.alts || 5);
const GAB = gab.replace(/\s+/g, '').toUpperCase();
const LET = 'ABCDE'.slice(0, NALT);

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdf)), useSystemFonts: true }).promise;

  // 1) linhas por coluna, usando coordenadas
  let lines = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const { width, height } = page.getViewport({ scale: 1 });
    const tc = await page.getTextContent();
    // ignora cabeçalho/rodapé da página (faixa de ~60pt em cima e embaixo)
    const items = tc.items.filter((i) => i.str && i.str.trim() && i.transform[5] > 60 && i.transform[5] < height - 60);
    const text = items.map((i) => i.str).join(' ');
    if (/VOC[ÊE] RECEBEU SUA FOLHA|AGUARDE A ORDEM DO FISCAL/i.test(text)) continue; // capa
    const mid = width / 2;
    for (const col of [items.filter((i) => i.transform[4] < mid), items.filter((i) => i.transform[4] >= mid)]) {
      col.sort((a, b) => (Math.abs(b.transform[5] - a.transform[5]) > 2.5 ? b.transform[5] - a.transform[5] : a.transform[4] - b.transform[4]));
      let curLine = null, curY = null, endX = 0;
      for (const it of col) {
        const y = it.transform[5], x = it.transform[4];
        if (curLine === null || Math.abs(y - curY) > 2.5) { if (curLine) lines.push(curLine); curLine = it.str; curY = y; }
        else { const gap = x - endX; curLine += (gap > 1.2 && !/\s$/.test(curLine) && !/^\s/.test(it.str) ? ' ' : '') + it.str; }
        endX = x + (it.width || 0);
      }
      if (curLine) lines.push(curLine);
    }
  }
  const isNoise = (l) => /INSTITUTO MAIS|CONCURSO P[ÚU]BLICO\s*-\s*EDITAL|REALIZA[ÇC][ÃA]O:?$/i.test(l) && l.trim().length < 140 || /^\s*\d+\s*$/.test(l);
  lines = lines.map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l && !isNoise(l));
  // alternativas curtas numa mesma linha ("(A) 30. (B) 33.") viram linhas separadas
  lines = lines.flatMap((l) => l.split(/\s+(?=\([A-E]\)\s)/));
  if (opt.debug) fs.writeFileSync(saida + '.lines.txt', lines.join('\n'));

  // 2) parse sequencial
  const SECOES = [[/L[ÍI]NGUA PORTUGUESA/i, 'Língua Portuguesa'], [/RACIOC[ÍI]NIO L[ÓO]GICO|MATEM[ÁA]TICA/i, 'Raciocínio Lógico-Matemático'], [/INFORM[ÁA]TICA/i, 'Noções de Informática'], [/LEGISLA[ÇC][ÃA]O/i, 'Legislação'], [/CONHECIMENTOS ESPEC[ÍI]FICOS/i, 'Conhecimentos Específicos'], [/CONHECIMENTOS GERAIS|ATUALIDADES/i, 'Conhecimentos Gerais'], [/CONTABILIDADE/i, 'Contabilidade']];
  const qs = []; let cur = null, mode = 'none', disc = 'Geral', passage = null, passageRange = null, pendingPassage = [];
  const startQ = (n, rest) => { cur = { n, disc, q: rest.trim(), o: [] }; mode = 'q'; if (passage && passageRange && n >= passageRange[0] && n <= passageRange[1]) cur.texto = passage; qs.push(cur); };
  const append = (l) => {
    if (mode === 'passage') { pendingPassage.push(l); return; }
    if (!cur) return;
    if (mode === 'o') cur.o[cur.o.length - 1] = (cur.o[cur.o.length - 1] + ' ' + l).trim();
    else if (mode === 'q') cur.q = (cur.q + ' ' + l).trim();
  };
  for (const l of lines) {
    const sec = SECOES.find(([re]) => re.test(l) && l === l.toUpperCase() && l.length < 60);
    if (sec) { disc = l.length < 60 ? l.replace(/\s+/g, ' ').replace(/^(\w)(.*)$/, (m, a, b) => a + b.toLowerCase()) : sec[1]; disc = sec[1] === 'Legislação' && /MUNICIPAL|INTERNA|FEDERAL/i.test(l) ? l.charAt(0) + l.slice(1).toLowerCase() : sec[1]; continue; }
    const next = qs.length + 1;
    const mp = /^(Leia|Considere|Observe|Analise|Com base|Utilize)[^.]*quest(?:ões|ão)\s+(?:de\s+)?(\d{1,2})(?:\s+(?:a|e)\s+(\d{1,2}))?/i.exec(l);
    if (mp) { passageRange = [Number(mp[2]), Number(mp[3] || mp[2])]; pendingPassage = []; mode = 'passage'; continue; }
    const mq = new RegExp('^(' + next + ')\\.\\s+(.*)$').exec(l);
    if (mq) { if (mode === 'passage') passage = pendingPassage.join(' ').trim(); startQ(Number(mq[1]), mq[2]); continue; }
    const ma = new RegExp('^\\(([' + LET + '])\\)\\s*(.*)$').exec(l);
    if (ma && cur) { const idx = LET.indexOf(ma[1]); if (idx === cur.o.length) { cur.o.push(ma[2].trim()); mode = 'o'; continue; } }
    append(l);
  }

  // 3) gabarito e validação
  const problems = [];
  qs.forEach((q, i) => {
    const g = GAB[i]; const idx = LET.indexOf(g);
    if (idx < 0) problems.push(`q${q.n}: gabarito inválido '${g}'`);
    q.a = idx;
    if (q.o.length !== NALT) problems.push(`q${q.n}: ${q.o.length} alternativas`);
    if (q.q.length < 15) problems.push(`q${q.n}: enunciado curto`);
    if (q.o.some((o) => o.length > 600)) problems.push(`q${q.n}: alternativa muito longa (${Math.max(...q.o.map((o) => o.length))}c)`);
    if (q.q.length > 2500) problems.push(`q${q.n}: enunciado muito longo (${q.q.length}c)`);
  });
  if (qs.length !== GAB.length) problems.push(`questões ${qs.length} ≠ gabarito ${GAB.length}`);

  const prova = { id: opt.id || saida.replace(/.*[\\/]/, '').replace(/\.json$/, ''), titulo: `${opt.orgao || ''} ${opt.ano || ''} · ${opt.cargo || ''}`.trim(), orgao: opt.orgao || '', ano: Number(opt.ano) || null, nivel: opt.nivel || '', cargo: opt.cargo || '', fonte: opt.fonte || 'Caderno de questões e gabarito oficiais publicados pela banca', alternativas: NALT, questoes: qs.map((q) => { const { texto, ...r } = q; return texto ? { ...r, texto } : r; }) };
  fs.writeFileSync(saida, JSON.stringify(prova, null, 1), 'utf8');
  console.log(`${qs.length} questões -> ${saida}`);
  const porDisc = {}; qs.forEach((q) => (porDisc[q.disc] = (porDisc[q.disc] || 0) + 1)); console.log('por disciplina:', JSON.stringify(porDisc));
  console.log('com texto de apoio:', qs.filter((q) => q.texto).length);
  if (problems.length) { console.log('PROBLEMAS:\n - ' + problems.join('\n - ')); process.exitCode = 2; } else console.log('sem problemas');
})().catch((e) => { console.error(e); process.exit(1); });
