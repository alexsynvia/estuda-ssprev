  // ---------- PROVAS REAIS DA BANCA ----------
  const PROVAS = window.PROVAS || [];
  const provaStats = (p) => (S.provas || {})[p.id] || null;
  V.provas = () => `
    ${pageTitle('Provas da banca', 'Cadernos reais aplicados pelo Instituto Mais em outros concursos, com gabarito oficial. Modo prova: sem correção até o fim. Modo treino: correção a cada questão.')}
    ${PROVAS.length ? PROVAS.map((p) => { const r = provaStats(p); const porDisc = {}; p.questoes.forEach((q) => { porDisc[q.disc] = (porDisc[q.disc] || 0) + 1; }); return `
      <div class="card">
        <div class="row between" style="align-items:flex-start"><div><div class="eyebrow">${h(p.orgao)} · ${p.ano} · ${h(p.nivel)}</div><b style="font-size:16px">${h(p.cargo)}</b></div>${r ? `<span class="chip ${r.best / p.questoes.length >= .7 ? 'ok' : 'yellow'}">${r.best}/${p.questoes.length}</span>` : `<span class="chip outline">${p.questoes.length} q</span>`}</div>
        <div class="chips" style="margin:10px 0 6px">${Object.entries(porDisc).map(([d, n]) => `<span class="chip">${h(d)} · ${n}</span>`).join('')}</div>
        ${r ? `<small class="muted">Feita ${r.vezes}x · melhor ${r.best}/${p.questoes.length} · última ${fmtLong(r.d)}</small>` : ''}
        <div class="grid2" style="margin-top:10px"><a class="btn" href="#/fazer-prova?id=${p.id}&modo=prova">${ic('clock')}Modo prova</a><a class="btn tonal" href="#/fazer-prova?id=${p.id}&modo=treino">${ic('target')}Modo treino</a></div>
      </div>`; }).join('') : `<div class="empty"><span class="tile">${ic('law')}</span><b>Nenhuma prova carregada</b>As provas reais da banca aparecem aqui quando importadas.</div>`}
    <div class="callout blue"><b>Como usar</b>Questões de outros cargos (Analista, Contador, Agente Administrativo) servem para treinar o estilo da banca: Português, legislação e contabilidade pública são os mesmos. Pule o que estiver fora do seu edital.</div>
  `;

  let pr = null;
  V.fazerProva = (params) => {
    const id = params.get('id'), modo = params.get('modo') || 'treino';
    const p = PROVAS.find((x) => String(x.id) === String(id));
    if (!p) return `<div class="empty"><b>Prova não encontrada</b><a class="btn tonal" href="#/provas" style="margin-top:12px">Voltar</a></div>`;
    const key = id + ':' + modo + ':' + (params.get('r') || '');
    if (!pr || pr.key !== key) pr = { key, p, modo, i: 0, resp: {}, picked: null, start: Date.now(), done: false };
    if (pr.done) return provaResult();
    const q = p.questoes[pr.i], total = p.questoes.length, picked = pr.modo === 'treino' ? pr.picked : (pr.resp[pr.i] ?? null);
    const letters = 'ABCDE';
    const segs = p.questoes.map((_, i) => { const r = pr.resp[i]; let c = ''; if (i === pr.i) c = 'cur'; else if (r !== undefined) c = pr.modo === 'treino' ? (r === p.questoes[i].a ? 'ok' : 'bad') : 'ok'; return `<i class="${c}"></i>`; }).join('');
    const answered = Object.keys(pr.resp).length;
    return `
      <div class="q-head"><span>${pr.i + 1} de ${total} · ${h(p.orgao)} ${p.ano}</span><span class="chip">${h(q.disc)}</span></div>
      <div class="segments">${segs}</div>
      <div class="q-text fade">${h(q.q)}</div>
      ${q.o.map((o, idx) => { let cls = ''; if (pr.modo === 'treino' && picked !== null) { if (idx === q.a) cls = 'correct'; else if (idx === picked) cls = 'wrong'; else cls = 'dim'; } else if (pr.modo === 'prova' && picked === idx) cls = 'correct'; return `<button class="opt ${cls}" data-popt="${idx}" ${pr.modo === 'treino' && picked !== null ? 'disabled' : ''}><span class="letter">${letters[idx]}</span><span>${h(o)}</span></button>`; }).join('')}
      ${pr.modo === 'treino' && picked !== null ? `<div class="explain fade ${picked === q.a ? 'ok' : 'bad'}"><b>${picked === q.a ? 'Certo!' : 'Não é essa.'}</b>Gabarito oficial: ${letters[q.a]}.</div>` : ''}
      <div class="row" style="margin-top:6px">
        <button class="btn ghost" data-action="p-prev" ${pr.i === 0 ? 'disabled' : ''}>Anterior</button>
        ${pr.modo === 'treino' && picked !== null && picked !== q.a ? `<button class="btn secondary" data-action="p-erro">${ic('note')}Caderno</button>` : ''}
        <button class="btn" style="flex:1" data-action="${pr.i + 1 < total ? 'p-next' : 'p-finish'}">${pr.i + 1 < total ? 'Próxima' : 'Finalizar'}${ic('chevr')}</button>
      </div>
      ${pr.modo === 'prova' ? `<p class="muted" style="font-size:13px;text-align:center;margin-top:12px">${answered}/${total} respondidas · ${fmtTime(Math.round((Date.now() - pr.start) / 1000))} decorridos${answered === total ? ` · <a href="#" data-action="p-finish">entregar agora</a>` : ''}</p>` : ''}
    `;
  };
  const provaResult = () => {
    const p = pr.p, total = p.questoes.length;
    const acertos = p.questoes.reduce((n, q, i) => n + (pr.resp[i] === q.a ? 1 : 0), 0);
    if (!pr.saved) {
      pr.saved = true; S.provas = S.provas || {}; const r = S.provas[p.id] || { vezes: 0, best: 0 };
      r.vezes++; r.best = Math.max(r.best, acertos); r.d = todayStr(); S.provas[p.id] = r;
      S.quiz.push({ d: new Date().toISOString(), total, correct: acertos, label: `${p.orgao} ${p.ano} (${pr.modo})`, tag: 'prova' }); touch();
    }
    const pct = Math.round((acertos / total) * 100), mins = Math.round((Date.now() - pr.start) / 60000);
    const porDisc = {}; p.questoes.forEach((q, i) => { const d = porDisc[q.disc] || (porDisc[q.disc] = { ok: 0, n: 0 }); d.n++; if (pr.resp[i] === q.a) d.ok++; });
    const wrongs = p.questoes.map((q, i) => ({ q, i })).filter(({ q, i }) => pr.resp[i] !== q.a);
    return `
      <div class="card result-big"><div class="eyebrow">${h(p.orgao)} ${p.ano} · ${h(p.cargo)}</div><div class="n">${acertos}<small>/${total}</small></div><div style="margin-top:8px"><span class="chip ${pct >= 70 ? 'ok' : pct >= 50 ? 'yellow' : 'red'}">${pct}% de acerto</span> <span class="chip">${mins} min</span></div></div>
      <div class="card">${Object.entries(porDisc).map(([d, v]) => { const pc = Math.round((v.ok / v.n) * 100); return `<div class="bar-row"><div class="row between"><span>${h(d)}</span><b class="display" style="font-size:15px">${v.ok}/${v.n}</b></div>${progress(pc)}</div>`; }).join('')}</div>
      ${wrongs.length ? `<h3>Para revisar (${wrongs.length})</h3>${wrongs.map(({ q, i }) => `<div class="card" style="padding:14px"><div class="eyebrow">Questão ${i + 1} · ${h(q.disc)}</div><div style="font-weight:600;font-size:14.5px;margin-top:4px">${h(q.q)}</div><div class="row" style="gap:6px;margin-top:8px;font-size:13.5px;color:var(--ok-ink)">${ic('check')}<span>${'ABCDE'[q.a]}) ${h(q.o[q.a])}</span></div>${pr.resp[i] !== undefined ? `<div class="muted" style="font-size:13px;margin-top:4px">Você marcou ${'ABCDE'[pr.resp[i]]}</div>` : '<div class="muted" style="font-size:13px;margin-top:4px">Em branco</div>'}</div>`).join('')}` : ''}
      <div class="sticky-actions"><a class="btn" style="flex:1" href="#/fazer-prova?id=${p.id}&modo=${pr.modo}&r=${Date.now()}">Refazer</a><a class="btn ghost" href="#/provas">Outras provas</a></div>
    `;
  };

