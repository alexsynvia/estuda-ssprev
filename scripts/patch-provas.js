// Patch único: adiciona o módulo "Provas da banca" ao app.js (rodar uma vez)
const fs = require('fs');
let a = fs.readFileSync('www/js/app.js', 'utf8');
if (a.includes('PROVAS REAIS DA BANCA')) { console.log('já aplicado'); process.exit(0); }
const rep = (x, y) => { if (!a.includes(x)) throw new Error('anchor: ' + x.slice(0, 60)); a = a.replace(x, y); };

// 1) item na tela Treino
rep(`      <div class="eyebrow" style="margin:18px 0 6px">Prova de verdade</div>
      ${'$'}{listItem('#/simulados', 'file', 'blue', 'Simulados oficiais', \`${'$'}{simDone}/3 registrados · 60 questões, 4h, à tarde\`)}`,
`      <div class="eyebrow" style="margin:18px 0 6px">Prova de verdade</div>
      ${'$'}{listItem('#/provas', 'law', 'green', 'Provas reais do Instituto Mais', \`${'$'}{(window.PROVAS || []).length} provas anteriores da banca, questão por questão\`)}
      ${'$'}{listItem('#/simulados', 'file', 'blue', 'Simulados oficiais', \`${'$'}{simDone}/3 registrados · 60 questões, 4h, à tarde\`)}`);

// 2) rotas
rep(`'simulados': { v: 'simulados', t: 'Simulados', tab: 'treino', back: true },`,
`'simulados': { v: 'simulados', t: 'Simulados', tab: 'treino', back: true }, 'provas': { v: 'provas', t: 'Provas da banca', tab: 'treino', back: true }, 'fazer-prova': { v: 'fazerProva', t: 'Prova', tab: 'treino', back: true },`);

// 3) views + runner
const bloco = fs.readFileSync('scripts/patch-provas.block.js', 'utf8');
rep(`  // ---------- SIMULADOS ----------
  V.simulados = () => \``, bloco + `
  // ---------- SIMULADOS ----------
  V.simulados = () => \``);

// 4) handlers
rep(`    const opt = e.target.closest('[data-opt]'); if (opt && quiz && !opt.disabled) { pickOption(Number(opt.dataset.opt)); return; }`,
`    const opt = e.target.closest('[data-opt]'); if (opt && quiz && !opt.disabled) { pickOption(Number(opt.dataset.opt)); return; }
    const popt = e.target.closest('[data-popt]'); if (popt && pr && !popt.disabled) { const idx = Number(popt.dataset.popt); pr.resp[pr.i] = idx; if (pr.modo === 'treino') { pr.picked = idx; vibrate(idx === pr.p.questoes[pr.i].a ? 15 : [40, 40, 40]); } touch(); render(); return; }`);
rep(`    if (a === 'next') { quiz.i++; quiz.picked = null; render(); window.scrollTo(0, 0); }`,
`    if (a === 'next') { quiz.i++; quiz.picked = null; render(); window.scrollTo(0, 0); }
    else if (a === 'p-next') { pr.i++; pr.picked = pr.modo === 'treino' ? null : pr.picked; render(); window.scrollTo(0, 0); }
    else if (a === 'p-prev') { pr.i = Math.max(0, pr.i - 1); pr.picked = pr.modo === 'treino' ? (pr.resp[pr.i] ?? null) : null; render(); window.scrollTo(0, 0); }
    else if (a === 'p-finish') { e.preventDefault(); const total = pr.p.questoes.length, answered = Object.keys(pr.resp).length; if (pr.modo === 'prova' && answered < total && !confirm(\`Ainda faltam ${'$'}{total - answered} questões. Entregar mesmo assim?\`)) return; pr.done = true; render(); window.scrollTo(0, 0); }
    else if (a === 'p-erro') { const q = pr.p.questoes[pr.i]; S.erros.push({ id: 'e' + Date.now(), assunto: q.disc, confundi: \`Marquei "${'$'}{q.o[pr.picked]}" em: ${'$'}{q.q}\`, regra: \`Gabarito: ${'$'}{q.o[q.a]} (${'$'}{pr.p.orgao} ${'$'}{pr.p.ano}, questão ${'$'}{pr.i + 1})\`, d: todayStr() }); touch(); toast('Anotado no caderno de erros'); el.disabled = true; el.innerHTML = \`${'$'}{ic('check')}No caderno\`; }`);
fs.writeFileSync('www/js/app.js', a);
console.log('patch aplicado');
