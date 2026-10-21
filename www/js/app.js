/* Estuda SSPREV — app principal (vanilla JS, offline, estado em localStorage) */
(() => {
  const D = window.DATA, Q = window.QUESTOES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const view = $('#view'), titleEl = $('#title'), backBtn = $('#btn-back'), topbar = $('#topbar');
  const Cap = window.Capacitor, Plug = (Cap && Cap.Plugins) || {};
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const hostTheme = document.documentElement.getAttribute('data-theme');

  // ---------- util ----------
  const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseDate(s); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const diffDays = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
  const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtDay = (s) => { const d = parseDate(s); return `${DOW[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
  const fmtLong = (s) => { const d = parseDate(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const PROVA_DAY = D.PROVA.data.slice(0, 10);
  const ESP_TAGS = ['cgeral', 'cpub', 'lrf', 'rpps', 'lic'];
  const ALL_DAYS = D.CRONOGRAMA.flatMap((w) => w.dias.map((d) => ({ ...d, semana: w.semana })));

  let toastT;
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2200); };
  const vibrate = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } };
  const openUrl = async (url) => {
    if (!url) return;
    try { if (Plug.Browser) { await Plug.Browser.open({ url }); return; } } catch (e) { }
    window.open(url, '_blank');
  };

  // ---------- ícones (inline SVG, traço 2) ----------
  const ICONS = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    chevr: '<path d="M9 6l6 6-6 6"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    law: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h6M9 16h6"/>',
    flame: '<path d="M12 22c4 0 7-2.8 7-6.8 0-3.4-2.4-5.6-3.6-7.6-.6 1.5-1.3 2.4-2.4 3-.2-2.8-1.6-5.4-4-7.6 0 3-1.5 4.4-3 6.3C4.7 11.4 5 13.4 5 15.2 5 19.2 8 22 12 22z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13M8 7h7"/>',
    note: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
    repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    file: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>',
    bag: '<path d="M6 8h12l1 13H5zM9 8V6a3 3 0 0 1 6 0v2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01M12 10h.01"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/>',
  };
  const ic = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const cbox = (attr, checked, disabled) => `<label class="cb"><input type="checkbox" ${attr} ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></label>`;

  // ---------- estado ----------
  const KEY = 'ssprev_v1';
  const defaults = () => ({ theme: 'auto', name: '', tasks: {}, activity: {}, quiz: [], answers: {}, sim: {}, erros: [], fc: {}, checks: {}, blocks: {}, reminder: { on: false, time: '19:30' }, minutes: {} });
  let S = defaults();
  try { const raw = localStorage.getItem(KEY); if (raw) S = { ...defaults(), ...JSON.parse(raw) }; } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  const touch = () => { S.activity[todayStr()] = true; save(); };
  const addMinutes = (m) => { const t = todayStr(); S.minutes[t] = (S.minutes[t] || 0) + m; touch(); };

  const streak = () => { let n = 0, d = todayStr(); if (!S.activity[d]) d = addDays(d, -1); while (S.activity[d]) { n++; d = addDays(d, -1); } return n; };
  const taskStats = (days = ALL_DAYS) => { let total = 0, done = 0; days.forEach((d) => { if (d.prova) return; total++; if (S.tasks[d.d + ':esp']) done++; if (d.pl) { total++; if (S.tasks[d.d + ':pl']) done++; } }); return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }; };
  const quizStats = () => { let t = 0, c = 0; S.quiz.forEach((q) => { t += q.total; c += q.correct; }); return { total: t, correct: c, pct: t ? Math.round((c / t) * 100) : 0 }; };
  const wrongIds = () => Object.entries(S.answers).filter(([, v]) => v.bad > 0 && v.bad >= v.ok).map(([k]) => k);
  const FC_INT = [0, 1, 3, 7, 15, 30];
  const fcDue = (tag) => D.FLASHCARDS.filter((c) => (!tag || c.tag === tag) && (!S.fc[c.id] || S.fc[c.id].due <= todayStr()));

  // ---------- tema ----------
  const applyTheme = () => {
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = S.theme === 'dark' || (S.theme === 'auto' && (hostTheme ? hostTheme === 'dark' : sys));
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    $('meta[name=theme-color]').setAttribute('content', dark ? '#121117' : '#F3F2F7');
    $('#btn-theme').innerHTML = ic(dark ? 'sun' : 'moon');
    try { Plug.StatusBar && Plug.StatusBar.setStyle({ style: dark ? 'DARK' : 'LIGHT' }); Plug.StatusBar && Plug.StatusBar.setBackgroundColor({ color: dark ? '#121117' : '#F3F2F7' }); } catch (e) { }
  };
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  $('#btn-theme').onclick = () => { const cur = document.documentElement.getAttribute('data-theme'); S.theme = cur === 'dark' ? 'light' : 'dark'; save(); applyTheme(); };

  // ---------- componentes ----------
  const linkKind = (l) => /^v[ií]deo/i.test(l) ? 'video' : /lei|lrf|estatuto|c[âa]mara|planalto|mcasp|site do sspr/i.test(l) ? 'law' : 'go';
  const links = (ls) => ls && ls.length ? `<div class="links">${ls.map((l) => { const k = linkKind(l.label); return `<button class="link-btn ${k}" data-ext="${h(l.url)}">${ic(k === 'video' ? 'play' : k === 'law' ? 'law' : 'ext')}${h(l.label)}</button>`; }).join('')}</div>` : '';
  const tagChip = (t, cls = '') => `<span class="chip ${cls}"><span class="tag-dot t-${t}"></span>${h(D.TAGS[t] || t)}</span>`;
  const progress = (pct) => `<div class="progress"><div style="width:${pct}%"></div></div>`;
  const miniRing = (pct, size = 34) => { const r = (size - 4) / 2, c = 2 * Math.PI * r; return `<svg class="w-ring" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="3.5"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`; };
  const listItem = (href, icon, tone, title, sub) => `<a class="list-item" href="${href}"><span class="tile ${tone}">${ic(icon)}</span><div class="li-body"><div class="li-title">${title}</div><div class="li-sub">${sub}</div></div>${ic('chevr', 'chev')}</a>`;
  const pageTitle = (t, sub) => `<h1 class="page-title">${h(t)}</h1>${sub ? `<p class="text-2" style="margin:-8px 0 16px">${sub}</p>` : ''}`;

  const dayCard = (d) => {
    const t = todayStr(), isToday = d.d === t, past = d.d < t;
    const espDone = !!S.tasks[d.d + ':esp'], plDone = !!S.tasks[d.d + ':pl'];
    const dt = parseDate(d.d);
    const chips = [];
    if (d.h) chips.push(`<span class="chip">${d.h}h de estudo</span>`);
    if (d.feriado) chips.push(`<span class="chip yellow">feriado</span>`);
    if (d.simulado) chips.push(`<span class="chip blue">Simulado ${d.simulado}</span>`);
    if (d.prova) chips.push(`<span class="chip red">Dia da prova</span>`);
    const task = (key, label, text, ls, done) => `
      <div class="task ${done ? 'done' : ''}">
        ${cbox(`data-task="${d.d}:${key}"`, done, d.prova)}
        <div class="task-body">
          <div class="task-label">${label}</div>
          <div class="task-text">${h(text)}</div>
          ${links(ls)}
        </div>
      </div>`;
    const espLabel = d.prova ? 'Prova' : d.simulado ? 'Simulado' : d.esp.tag === 'rev' ? 'Revisão' : `Específicos · ${D.TAGS[d.esp.tag] || ''}`;
    return `<div class="day ${isToday ? 'today' : ''} ${past ? 'past' : ''}" id="day-${d.d}">
      <div class="d-date"><div class="d-dow">${isToday ? 'hoje' : DOW[dt.getDay()]}</div><div class="d-num">${dt.getDate()}</div><div class="d-dow" style="font-weight:600;letter-spacing:0;text-transform:none">${MES[dt.getMonth()]}</div></div>
      <div class="d-body">
        <div class="d-chips">${chips.join('')}</div>
        ${task('esp', espLabel, d.esp.t, d.esp.links, espDone)}
        ${d.pl ? task('pl', d.pl.m === 'Port' ? 'Português' : 'Legislação municipal', d.pl.t, d.pl.links, plDone) : ''}
      </div>
    </div>`;
  };

  // ---------- telas ----------
  const V = {};

  V.home = () => {
    const t = todayStr(), days = diffDays(t, PROVA_DAY), ts = taskStats(), qs = quizStats(), st = streak();
    const todayD = ALL_DAYS.find((d) => d.d === t);
    const next = ALL_DAYS.find((d) => d.d > t);
    const due = fcDue().length, wrong = wrongIds().length;
    const tip = D.TRUQUES[Math.floor((parseDate(t) - new Date(2026, 0, 1)) / 86400000) % D.TRUQUES.length];
    const hour = new Date().getHours();
    const saud = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
    let count;
    if (days > 1) count = `<div class="count">${days}<small>dias</small></div><div class="sub">até a prova, ${D.PROVA.dataTexto.replace('domingo, ', 'domingo ')} em ${h(D.PROVA.local)}</div>`;
    else if (days === 1) count = `<div class="count" style="font-size:44px">Amanhã</div><div class="sub">é a prova. Revisão leve de manhã, descanso à tarde. Separe documento e canetas.</div>`;
    else if (days === 0) count = `<div class="count" style="font-size:44px">É hoje</div><div class="sub">Chegue 30 min antes. Comece pelos Específicos. Nenhuma em branco.</div>`;
    else count = `<div class="count" style="font-size:40px">Prova feita</div><div class="sub">Gabarito no site do Instituto Mais. Recurso em 2 dias úteis.</div>`;
    return `
      <div class="row between" style="margin:4px 0 14px">
        <div><div class="eyebrow">${saud}${S.name ? ', ' + h(S.name) : ''}</div><h1 class="page-title" style="margin:2px 0 0;font-size:26px">${fmtDay(t)}</h1></div>
        ${st ? `<span class="streak">${ic('flame')}${st} dia${st === 1 ? '' : 's'}</span>` : ''}
      </div>
      <div class="hero">
        <div class="eyebrow">Técnico de Contabilidade Previdenciário · SSPREV</div>
        ${count}
        <div class="hero-foot">${progress(ts.pct)}<span style="white-space:nowrap">${ts.done}/${ts.total} tarefas</span></div>
      </div>
      ${updateCard()}

      <div class="section-head"><h3>Hoje</h3><a href="#/plano">ver plano</a></div>
      ${todayD ? dayCard(todayD) : next ? `<div class="card tonal"><div class="card-title">${ic('info')} O cronograma começa em ${fmtDay(next.d)}</div><p class="text-2" style="margin:0;font-size:14px">Enquanto isso, leia o <a href="#/metodo">método</a> e faça um <a href="#/quiz?mode=rapido">quiz rápido</a> para medir onde você está.</p></div>${dayCard(next)}` : `<div class="card"><div class="card-title">Cronograma concluído</div><p class="muted">Boa sorte!</p></div>`}

      <div class="section-head"><h3>Treinar agora</h3></div>
      <div class="grid2">
        <a class="action" href="#/quiz?mode=rapido"><span class="tile green">${ic('bolt')}</span><div><div class="a-title">Quiz rápido</div><div class="a-sub">10 questões</div></div></a>
        <a class="action" href="#/flash"><span class="tile yellow">${ic('cards')}</span><div><div class="a-title">Flashcards</div><div class="a-sub">${due} para hoje</div></div></a>
        <a class="action" href="#/timer"><span class="tile blue">${ic('clock')}</span><div><div class="a-title">Timer</div><div class="a-sub">blocos 50/10</div></div></a>
        <a class="action" href="#/erros"><span class="tile">${ic('note')}</span><div><div class="a-title">Caderno</div><div class="a-sub">${S.erros.length} erro${S.erros.length === 1 ? '' : 's'}</div></div></a>
      </div>

      <div class="section-head"><h3>Desempenho</h3><a href="#/historico">histórico</a></div>
      <div class="stats">
        <div><div class="v">${qs.total}</div><div class="l">questões</div></div>
        <div><div class="v">${qs.pct}<span style="font-size:16px">%</span></div><div class="l">acerto</div></div>
        <div><div class="v">${wrong}</div><div class="l">a refazer</div></div>
      </div>
      ${wrong ? `<a class="btn tonal block" href="#/quiz?mode=erradas" style="margin-top:10px">${ic('repeat')}Refazer as ${wrong} que errei</a>` : ''}

      <div class="callout" style="margin-top:20px"><b>Dica do dia</b>${h(tip)}</div>
      ${listItem('#/edital', 'file', '', 'A prova em números', 'Edital, pesos, nota mínima, desempate')}
    `;
  };

  V.plano = () => {
    const ts = taskStats(), t = todayStr();
    const curWeek = (ALL_DAYS.find((d) => d.d >= t) || ALL_DAYS[ALL_DAYS.length - 1]).semana;
    return `
      ${pageTitle('Plano de estudos')}
      <div class="card">
        <div class="row between"><b>Progresso geral</b><span class="display" style="font-weight:800;font-size:22px">${ts.pct}%</span></div>
        <div style="margin:10px 0 8px">${progress(ts.pct)}</div>
        <small class="muted">${ts.done} de ${ts.total} tarefas. Meta: 2h30 por dia útil e 4h no fim de semana (≈ 85 horas até a prova). Mínimo em dia corrido: 1h30.</small>
      </div>
      <div class="grid2" style="margin-bottom:12px">
        <a class="btn secondary" href="#/metodo">${ic('book')}Como estudar</a>
        <a class="btn secondary" href="#/timer">${ic('clock')}Dividir o dia</a>
      </div>
      <div class="callout blue">${h(D.AJUSTE_CRONO)}</div>
      ${D.CRONOGRAMA.map((w) => { const ws = taskStats(w.dias); return `
        <details class="week ${w.semana === curWeek ? 'current' : ''}" ${w.semana === curWeek ? 'open' : ''}>
          <summary><span class="w-num">S${w.semana}</span><span class="w-title"><b>${h(w.titulo)}</b><small>${fmtDay(w.dias[0].d).slice(4)} a ${fmtDay(w.dias[w.dias.length - 1].d).slice(4)} · ${ws.done}/${ws.total}</small></span>${miniRing(ws.pct)}${ic('chev', 'chev')}</summary>
          <div>${w.dias.map((d) => dayCard({ ...d, semana: w.semana })).join('')}</div>
        </details>`; }).join('')}
      <p class="muted" style="font-size:13.5px">Depois da teoria, sempre 20 a 30 questões do mesmo tema no Gran Questões (grátis), filtrando pelo assunto e, se der, pela banca IMAIS.</p>
      ${links([{ label: 'Gran Questões - IMAIS', url: D.LEIS.gran }])}
    `;
  };

  V.metodo = () => `
    ${pageTitle('Como estudar')}
    <div class="callout"><b>Regra de ouro</b>Com só um mês, pouca teoria e muita questão. Assistir ou ler o mínimo para entender e logo resolver questões do mesmo assunto. Questão é o que mais fixa e mostra como a banca pergunta.</div>
    <div class="card" style="padding:4px 16px">${D.METODO.map((m, i) => `<div class="topic"><div class="row" style="gap:12px;align-items:flex-start"><span class="display" style="font-weight:800;color:var(--primary);font-size:20px;width:28px;flex:none">${i + 1}</span><div><div class="t">${h(m[0])}</div><div class="s">${h(m[1])}</div></div></div></div>`).join('')}</div>
    <h3>Truques de prova</h3>
    <div class="card tonal">${D.TRUQUES.slice(0, 4).map((t) => `<div class="check"><span class="tile" style="width:28px;height:28px;border-radius:8px;background:var(--surface)">${ic('sparkle')}</span><span>${h(t)}</span></div>`).join('')}</div>
    <h3>Ambiente de estudo</h3>
    <div class="card tonal">${D.AMBIENTE.map((t) => `<div class="check"><span>${h(t)}</span></div>`).join('')}</div>
    <h3>Um dia útil em 150 minutos</h3>
    <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Bloco</th><th>Tempo</th><th>O que fazer</th></tr></thead><tbody>${D.BLOCO_DIA.map((b) => `<tr><td>${b[0]}</td><td style="white-space:nowrap">${b[1]}</td><td>${h(b[2])}</td></tr>`).join('')}</tbody></table></div>
    <p class="muted" style="font-size:13.5px;margin-top:10px">Fim de semana: mesma lógica, com 2 blocos de teoria e um simulado ou bateria grande de questões (30 a 60, cronometradas).</p>
    <a class="btn block" href="#/timer" style="margin-top:10px">${ic('clock')}Abrir o timer dos blocos</a></div>
  `;

  V.edital = () => `
    ${pageTitle('A prova em números')}
    <div class="card"><table class="table kv"><tbody>${D.PROVA.edital.map((r) => `<tr><td>${h(r[0])}</td><td>${h(r[1])}</td></tr>`).join('')}</tbody></table></div>
    <h3>Na prática</h3>
    ${D.PROVA.insights.map((t) => `<div class="callout green">${h(t)}</div>`).join('')}
    ${links([{ label: 'Página do concurso (Instituto Mais)', url: D.LEIS.imais }, { label: 'Site do SSPREV', url: D.LEIS.ssprev }])}
  `;

  V.materias = () => `
    ${pageTitle('Matérias', 'Resumos do guia, vídeo e texto da lei em cada tema, com atalho para questões e flashcards.')}
    ${listItem('#/materias/esp', 'calc', 'green', 'Conhecimentos Específicos', `40 na prova · ${Q.filter((q) => ESP_TAGS.includes(q.t)).length} questões no app · contabilidade geral, pública e leis do cargo`)}
    ${listItem('#/materias/port', 'pen', 'yellow', 'Língua Portuguesa', `10 na prova · ${Q.filter((q) => q.t === 'port').length} questões no app · interpretação, concordância, crase, colocação`)}
    ${listItem('#/materias/leg', 'building', 'blue', 'Legislação Municipal', `10 na prova · ${Q.filter((q) => q.t === 'leg').length} questões no app · Estatuto (LC 146/2011) e Lei Orgânica`)}
    <div class="callout" style="margin-top:16px"><b>Onde o tempo vai</b>Cerca de 60% em Específicos. Português e Legislação são pontos baratos: mirar 8/10 em cada.</div>
    ${listItem('#/onde', 'globe', '', 'Onde estudar', 'Plataformas grátis, vídeos, texto das leis, MCASP')}
  `;

  const topicRow = (tp, tag) => `
    <div class="topic">
      <div class="t">${h(tp.t)}</div>
      <div class="s">${h(tp.s)}</div>
      <div class="links">
        ${tp.v ? `<button class="link-btn video" data-ext="${h(tp.v)}">${ic('play')}vídeo</button>` : ''}
        ${tp.lei ? `<button class="link-btn law" data-ext="${h(tp.lei.url)}">${ic('law')}${h(tp.lei.label)}</button>` : ''}
        ${tag && Q.some((q) => q.t === tag) ? `<a class="link-btn go" href="#/quiz?tag=${tag}">${ic('target')}questões</a>` : ''}
        ${tag && D.FLASHCARDS.some((c) => c.tag === tag) ? `<a class="link-btn go" href="#/flash?tag=${tag}">${ic('cards')}flashcards</a>` : ''}
      </div>
    </div>`;

  V.esp = () => `
    ${pageTitle('Conhecimentos Específicos', h(D.ESPECIFICOS.intro))}
    ${D.ESPECIFICOS.blocos.map((b, i) => `
      <details class="acc" ${i === 1 ? 'open' : ''}>
        <summary><span>${h(b.titulo)}</span><span class="chip yellow" style="margin-left:auto">${h(b.peso)}</span>${ic('chev', 'chev')}</summary>
        <div class="acc-body">
          ${b.topicos.map((tp) => topicRow(tp, tp.tag || (b.id === 'leis' ? null : b.id))).join('')}
          ${b.ref ? `<div class="callout blue" style="margin-top:12px">${h(b.ref)}<div class="links"><button class="link-btn law" data-ext="${h(D.LEIS.mcasp)}">${ic('law')}MCASP</button></div></div>` : ''}
        </div>
      </details>`).join('')}
    <div class="grid2" style="margin-top:8px">
      <a class="btn" href="#/quiz?tag=esp">${ic('target')}Quiz</a>
      <a class="btn tonal" href="#/flash?tag=esp">${ic('cards')}Flashcards</a>
    </div>
  `;

  V.port = () => `
    ${pageTitle('Língua Portuguesa', h(D.PORTUGUES.intro))}
    <div class="card" style="padding:4px 16px">${D.PORTUGUES.topicos.map((tp) => topicRow(tp)).join('')}</div>
    <div class="callout blue">${h(D.PORTUGUES.canais)}</div>
    <p class="text-2" style="font-size:14.5px"><b>Treino:</b> ${h(D.PORTUGUES.treino)}</p>
    <div class="grid2">
      <a class="btn" href="#/quiz?tag=port">${ic('target')}Quiz</a>
      <a class="btn tonal" href="#/flash?tag=port">${ic('cards')}Flashcards</a>
    </div>
    ${links([{ label: 'Gran Questões - IMAIS', url: D.LEIS.gran }, { label: 'vídeos Professor Noslen', url: D.yt('professor noslen') }, { label: 'vídeos Português com Letícia', url: D.yt('português com letícia') }])}
  `;

  V.leg = () => {
    const L = D.LEGISLACAO;
    const list = (arr, key) => arr.map((it, i) => { const k = `${key}:${i}`, done = !!S.checks[k]; return `<div class="check ${done ? 'done' : ''}">${cbox(`data-check="${k}"`, done)}<span>${h(it)}</span></div>`; }).join('');
    return `
      ${pageTitle('Legislação Municipal', h(L.intro))}
      <div class="callout"><b>Atenção</b>${h(L.alerta)}</div>
      <details class="acc" open>
        <summary>${h(L.estatuto.titulo)}${ic('chev', 'chev')}</summary>
        <div class="acc-body">
          <p class="text-2" style="font-size:14px;margin-top:0">${h(L.estatuto.texto)}</p>
          ${links([{ label: 'Câmara: legislação', url: L.estatuto.url }])}
          <div class="eyebrow" style="margin:16px 0 4px">O que mais cai · marque o que já leu</div>
          ${list(L.estatuto.itens, 'estatuto')}
          <div class="callout green" style="margin-top:12px"><b>Dica</b>${h(L.estatuto.dica)}</div>
        </div>
      </details>
      <details class="acc">
        <summary>${h(L.organica.titulo)}${ic('chev', 'chev')}</summary>
        <div class="acc-body">
          <p class="text-2" style="font-size:14px;margin-top:0">${h(L.organica.texto)}</p>
          ${links([{ label: 'Câmara: legislação', url: L.organica.url }])}
          <div class="eyebrow" style="margin:16px 0 4px">Focar em · marque o que já leu</div>
          ${list(L.organica.itens, 'organica')}
          <div class="eyebrow" style="margin:16px 0 4px">Vídeos gerais para entender a lógica</div>
          ${links(L.organica.videos.map((v) => ({ label: 'vídeo: ' + v.label, url: v.url })))}
          <div class="callout blue" style="margin-top:12px"><b>Dica</b>${h(L.organica.dica)}</div>
        </div>
      </details>
      <div class="grid2" style="margin-top:8px">
        <a class="btn" href="#/quiz?tag=leg">${ic('target')}Quiz</a>
        <a class="btn tonal" href="#/flash?tag=leg">${ic('cards')}Flashcards</a>
      </div>
    `;
  };

  V.treino = () => {
    const due = fcDue().length, wrong = wrongIds().length, qs = quizStats();
    const simDone = Object.keys(S.sim).length;
    return `
      ${pageTitle('Treino')}
      ${listItem('#/quiz?mode=rapido', 'bolt', 'green', 'Quiz rápido', '10 questões aleatórias de todas as matérias')}
      ${listItem('#/quiz?mode=mini', 'flask', 'blue', 'Mini-simulado', '20 questões na proporção da prova (3 Port · 3 Leg · 14 Esp)')}
      ${listItem('#/fazer-prova?id=simulado&modo=prova&r=' + Date.now(), 'file', 'yellow', 'Simulado completo', '60 questões como no edital (10 Port · 10 Leg · 40 Esp) · 4 horas · correção só no fim')}
      ${listItem('#/quiz?mode=erradas', 'repeat', wrong ? 'red' : '', 'Refazer erradas', wrong ? wrong + ' questões que você errou' : 'Nenhuma pendente')}
      <div class="eyebrow" style="margin:18px 0 6px">Quiz por matéria</div>
      <div class="chips">${Object.keys(D.TAGS).filter((t) => Q.some((q) => q.t === t)).map((t) => `<a class="chip" href="#/quiz?tag=${t}"><span class="tag-dot t-${t}"></span>${h(D.TAGS[t])} · ${Q.filter((q) => q.t === t).length}</a>`).join('')}</div>
      <div class="eyebrow" style="margin:18px 0 6px">Memorização</div>
      ${listItem('#/flash', 'cards', 'yellow', 'Flashcards', `${due} para hoje · ${D.FLASHCARDS.length} no total · revisão espaçada`)}
      <div class="eyebrow" style="margin:18px 0 6px">Prova de verdade</div>
      ${(window.PROVAS || []).length ? listItem('#/provas', 'law', 'green', 'Provas reais do Instituto Mais', `${(window.PROVAS || []).length} provas anteriores da banca, questão por questão`) : ''}
      ${listItem('#/simulados', 'file', 'blue', 'Simulados oficiais', `${simDone}/3 registrados · 60 questões, 4h, à tarde`)}
      ${listItem('#/historico', 'chart', '', 'Histórico', `${qs.total} questões · ${qs.pct}% de acerto`)}
    `;
  };

  V.historico = () => {
    const byTag = {};
    Object.entries(S.answers).forEach(([id, v]) => { const q = Q.find((x) => x.id === id); if (!q) return; const b = byTag[q.t] || (byTag[q.t] = { ok: 0, bad: 0 }); b.ok += v.ok; b.bad += v.bad; });
    const rows = Object.entries(byTag).map(([t, v]) => { const tot = v.ok + v.bad, pct = tot ? Math.round((v.ok / tot) * 100) : 0; return `<div class="bar-row"><div class="row between"><span>${tagChip(t)}</span><b class="display" style="font-size:16px">${pct}% <small class="muted" style="font-family:var(--font-body);font-weight:500">${v.ok}/${tot}</small></b></div>${progress(pct)}</div>`; }).join('');
    const minutes = Object.values(S.minutes).reduce((a, b) => a + b, 0);
    return `
      ${pageTitle('Histórico')}
      <div class="stats">
        <div><div class="v">${quizStats().total}</div><div class="l">questões</div></div>
        <div><div class="v">${quizStats().pct}<span style="font-size:16px">%</span></div><div class="l">acerto</div></div>
        <div><div class="v">${Math.round(minutes / 60 * 10) / 10}<span style="font-size:16px">h</span></div><div class="l">no timer</div></div>
      </div>
      <h3>Acerto por matéria</h3>
      <div class="card">${rows || '<p class="muted" style="margin:0">Faça um quiz para ver as estatísticas.</p>'}</div>
      <h3>Últimos quizzes</h3>
      <div class="card">${S.quiz.length ? S.quiz.slice(-15).reverse().map((q) => `<div class="hist"><span>${fmtLong(q.d.slice(0, 10))} · ${h(q.label)}</span><b>${q.correct}/${q.total}</b></div>`).join('') : '<p class="muted" style="margin:0">Nenhum quiz ainda.</p>'}</div>
      <h3>Simulados</h3>
      <div class="card">${D.SIMULADOS.lista.map((s) => `<div class="hist"><span>Simulado ${s.n} · ${fmtDay(s.data)}</span><b>${S.sim[s.n] ? S.sim[s.n].acertos + '/60' : '—'}</b></div>`).join('')}</div>
    `;
  };

  // ---------- QUIZ ----------
  let quiz = null;
  const buildQuiz = (params) => {
    const mode = params.get('mode'), tag = params.get('tag');
    let pool, label, n = 10;
    if (mode === 'erradas') { const ids = wrongIds(); pool = Q.filter((q) => ids.includes(q.id)); label = 'Refazer erradas'; n = pool.length; }
    else if (mode === 'mini') { pool = [...shuffle(Q.filter((q) => q.t === 'port')).slice(0, 3), ...shuffle(Q.filter((q) => q.t === 'leg')).slice(0, 3), ...shuffle(Q.filter((q) => ESP_TAGS.includes(q.t))).slice(0, 14)]; label = 'Mini-simulado'; n = 20; }
    else if (tag === 'esp') { pool = Q.filter((q) => ESP_TAGS.includes(q.t)); label = 'Específicos'; }
    else if (tag) { pool = Q.filter((q) => q.t === tag); label = D.TAGS[tag] || tag; }
    else { pool = Q; label = 'Quiz rápido'; }
    const w = (q) => { const a = S.answers[q.id]; if (!a) return 0; if (a.bad > a.ok) return 1; return 2 + a.ok; };
    const items = shuffle(pool).sort((a, b) => w(a) - w(b)).slice(0, n);
    return { items: mode === 'mini' ? shuffle(items) : items, i: 0, correct: 0, picked: null, label, tag: tag || mode || 'all', results: [] };
  };

  V.quiz = (params) => {
    if (!quiz || quiz.key !== params.toString()) { quiz = buildQuiz(params); quiz.key = params.toString(); }
    if (!quiz.items.length) return `<div class="empty"><span class="tile green">${ic('check')}</span><b>Nada pendente aqui</b>Você não tem questões erradas para refazer.<br><a class="btn tonal" href="#/treino" style="margin-top:16px">Voltar ao treino</a></div>`;
    if (quiz.i >= quiz.items.length) return quizResult();
    const q = quiz.items[quiz.i], picked = quiz.picked;
    const segs = quiz.items.map((_, i) => { const r = quiz.results[i]; return `<i class="${r ? (r.ok ? 'ok' : 'bad') : i === quiz.i ? 'cur' : ''}"></i>`; }).join('');
    return `
      <div class="q-head"><span>${quiz.i + 1} de ${quiz.items.length} · ${h(quiz.label)}</span><span class="row" style="gap:6px">${q.src ? `<span class="chip yellow" title="Questão real da banca">${h(q.src.split(' (')[0])}</span>` : ''}${tagChip(q.t)}</span></div>
      <div class="segments">${segs}</div>
      ${q.texto ? `<details class="acc passage" open><summary>Texto de apoio${ic('chev', 'chev')}</summary><div class="acc-body"><p class="text-2" style="font-size:14.5px;line-height:1.55;margin:0;white-space:pre-line">${h(q.texto)}</p></div></details>` : ''}
      <div class="q-text fade">${h(q.q)}</div>
      ${q.o.map((o, idx) => { let cls = ''; if (picked !== null) { if (idx === q.a) cls = 'correct'; else if (idx === picked) cls = 'wrong'; else cls = 'dim'; } return `<button class="opt ${cls}" data-opt="${idx}" ${picked !== null ? 'disabled' : ''}><span class="letter">${'ABCDE'[idx]}</span><span>${h(o)}</span></button>`; }).join('')}
      ${picked !== null ? `<div class="explain fade ${picked === q.a ? 'ok' : 'bad'}"><b>${picked === q.a ? 'Certo!' : 'Não é essa.'}</b>${h(q.e)}</div>
        <div class="row">
          ${picked !== q.a ? `<button class="btn secondary" data-action="add-erro" data-qid="${q.id}">${ic('note')}Caderno</button>` : ''}
          <button class="btn" style="flex:1" data-action="next">${quiz.i + 1 < quiz.items.length ? 'Próxima' : 'Ver resultado'}${ic('chevr')}</button>
        </div>` : ''}
    `;
  };

  const quizResult = () => {
    if (!quiz.saved) { quiz.saved = true; S.quiz.push({ d: new Date().toISOString(), total: quiz.items.length, correct: quiz.correct, label: quiz.label, tag: quiz.tag }); touch(); }
    const pct = Math.round((quiz.correct / quiz.items.length) * 100);
    const msg = pct >= 80 ? 'Excelente. Nível de aprovação.' : pct >= 60 ? 'Bom. Revise as erradas e repita amanhã.' : 'Volte à teoria desse tema e refaça amanhã.';
    const wrongs = quiz.results.filter((r) => !r.ok);
    return `
      <div class="card result-big">
        <div class="eyebrow">${h(quiz.label)}</div>
        <div class="n">${quiz.correct}<small>/${quiz.items.length}</small></div>
        <div style="margin-top:8px"><span class="chip ${pct >= 75 ? 'ok' : pct >= 50 ? 'yellow' : 'red'}">${pct}% de acerto</span></div>
        <p class="text-2" style="margin-top:10px">${msg}</p>
      </div>
      ${wrongs.length ? `<h3>O que você errou</h3>${wrongs.map((r) => { const q = Q.find((x) => x.id === r.id); return `<div class="card" style="padding:14px"><div style="font-weight:600;font-size:14.5px">${h(q.q)}</div><div class="row" style="gap:6px;margin-top:8px;font-size:13.5px;color:var(--ok-ink)">${ic('check')}<span>${h(q.o[q.a])}</span></div></div>`; }).join('')}` : ''}
      <div class="sticky-actions">
        ${wrongs.length ? `<a class="btn secondary" href="#/quiz?mode=erradas&r=${Date.now()}">Refazer erradas</a>` : ''}
        <a class="btn" style="flex:1" href="#/quiz?${quiz.key.replace(/&r=\d+/, '')}&r=${Date.now()}">Novo quiz</a>
        <a class="btn ghost" href="#/treino">Sair</a>
      </div>
    `;
  };

  const pickOption = (idx) => {
    const q = quiz.items[quiz.i]; if (quiz.picked !== null) return;
    quiz.picked = idx; const ok = idx === q.a;
    if (ok) { quiz.correct++; vibrate(15); } else vibrate([40, 40, 40]);
    quiz.results.push({ id: q.id, ok });
    const a = S.answers[q.id] || (S.answers[q.id] = { ok: 0, bad: 0 }); ok ? a.ok++ : a.bad++;
    touch(); render();
  };

  // ---------- FLASHCARDS ----------
  let fc = null;
  V.flash = (params) => {
    const tag = params.get('tag');
    const key = 'fc:' + (tag || 'all');
    if (!fc || fc.key !== key) {
      let cards = tag === 'esp' ? D.FLASHCARDS.filter((c) => ESP_TAGS.includes(c.tag) && (!S.fc[c.id] || S.fc[c.id].due <= todayStr())) : fcDue(tag);
      fc = { key, queue: shuffle(cards).slice(0, 25), flipped: false, done: 0, hits: 0, requeued: 0 };
    }
    if (!fc.queue.length) {
      const boxes = [0, 0, 0, 0, 0, 0]; D.FLASHCARDS.forEach((c) => { boxes[(S.fc[c.id] && S.fc[c.id].box) || 0]++; });
      return `
        ${pageTitle('Flashcards')}
        <div class="empty"><span class="tile yellow">${ic('cards')}</span><b>${fc.done ? `${fc.hits} de ${fc.done} na primeira tentativa` : 'Nada para revisar agora'}</b>Os cartões voltam pela revisão espaçada: 1, 3, 7, 15 e 30 dias.</div>
        <div class="card"><div class="eyebrow" style="margin-bottom:10px">Suas caixas</div>
          <div class="grid3">${['Novos', 'Caixa 1', 'Caixa 2', 'Caixa 3', 'Caixa 4', 'Dominados'].map((l, i) => `<div class="inset" style="text-align:center"><div class="display" style="font-weight:800;font-size:22px">${boxes[i]}</div><small class="muted">${l}</small></div>`).join('')}</div>
        </div>
        <div class="eyebrow" style="margin:14px 0 6px">Revisar por matéria</div>
        <div class="chips">${Object.keys(D.TAGS).filter((t) => D.FLASHCARDS.some((c) => c.tag === t)).map((t) => `<a class="chip" href="#/flash?tag=${t}&r=${Date.now()}"><span class="tag-dot t-${t}"></span>${h(D.TAGS[t])} · ${fcDue(t).length}</a>`).join('')}</div>
        <a class="btn tonal block" href="#/flash?all=1&r=${Date.now()}" data-action="fc-all" style="margin-top:8px">Revisar todos mesmo assim</a>`;
    }
    const c = fc.queue[0];
    return `
      <div class="q-head"><span>${fc.done + 1} de ${fc.done + fc.queue.length}</span><span class="row" style="gap:6px">${ic('check')}${fc.hits}</span></div>
      <div class="progress" style="margin-bottom:18px"><div style="width:${Math.round((fc.done / (fc.done + fc.queue.length)) * 100)}%"></div></div>
      <div class="fc ${fc.flipped ? 'flipped' : ''}" data-action="flip">
        <div class="fc-inner">
          <div class="fc-face"><span class="fc-tag">${tagChip(c.tag)}</span>${h(c.f)}<span class="hint">toque para ver a resposta</span></div>
          <div class="fc-face back"><span class="fc-tag eyebrow" style="color:var(--primary-soft-ink);opacity:.8">Resposta</span>${h(c.v)}</div>
        </div>
      </div>
      <div class="row" style="margin-top:18px">
        ${fc.flipped ? `<button class="btn danger" style="flex:1" data-action="fc-bad">Errei</button><button class="btn ok" style="flex:1" data-action="fc-ok">${ic('check')}Acertei</button>` : `<button class="btn block" data-action="flip">Virar cartão</button>`}
      </div>
    `;
  };
  const fcAnswer = (ok) => {
    const c = fc.queue.shift(); const st = S.fc[c.id] || { box: 0, due: todayStr() };
    fc.done++;
    if (ok) { fc.hits++; st.box = Math.min(5, st.box + 1); st.due = addDays(todayStr(), FC_INT[st.box]); vibrate(15); }
    else { st.box = 1; st.due = addDays(todayStr(), 1); vibrate(40); if (fc.requeued < 30) { fc.queue.push(c); fc.requeued++; fc.done--; } }
    S.fc[c.id] = st; fc.flipped = false; touch(); render();
  };

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

  // Simulado completo: 60 questões sorteadas do banco na proporção do edital (10 Port · 10 Leg · 40 Esp), ordem da prova real
  const SIM_COMP = [['port', 10], ['leg', 10]];
  const SIM_ESP = [['cgeral', 7], ['cpub', 20], ['lrf', 5], ['rpps', 4], ['lic', 4]];
  const buildSimulado = () => {
    const take = (t, n) => shuffle(Q.filter((q) => q.t === t)).slice(0, n);
    const itens = [...SIM_COMP.flatMap(([t, n]) => take(t, n)), ...shuffle(SIM_ESP.flatMap(([t, n]) => take(t, n)))];
    return { id: 'simulado', titulo: 'Simulado completo', orgao: 'Simulado SSPREV', ano: 2026, nivel: 'Médio/Técnico', cargo: 'Técnico de Contabilidade Previdenciário', limite: 240, questoes: itens.map((q, i) => ({ n: i + 1, id: q.id, t: q.t, disc: q.t === 'port' ? 'Língua Portuguesa' : q.t === 'leg' ? 'Legislação Municipal' : 'Específicos · ' + D.TAGS[q.t], q: q.q, o: q.o, a: q.a, e: q.e, texto: q.texto, src: q.src })) };
  };
  let pr = null, prTick = null;
  const prTimeTxt = () => { const el = Math.round((Date.now() - pr.start) / 1000); if (pr.p.limite) { const rest = pr.p.limite * 60 - el; return rest > 0 ? `restam ${fmtTime(rest)} de ${pr.p.limite / 60}h` : 'tempo esgotado: entregue a prova'; } return `${fmtTime(el)} decorridos`; };
  V.fazerProva = (params) => {
    const id = params.get('id'), modo = params.get('modo') || 'treino';
    const key = id + ':' + modo + ':' + (params.get('r') || '');
    const p = id === 'simulado' ? (pr && pr.key === key ? pr.p : buildSimulado()) : PROVAS.find((x) => String(x.id) === String(id));
    if (!p) return `<div class="empty"><b>Prova não encontrada</b><a class="btn tonal" href="#/treino" style="margin-top:12px">Voltar</a></div>`;
    if (!pr || pr.key !== key) pr = { key, p, modo, i: 0, resp: {}, picked: null, start: Date.now(), done: false };
    clearInterval(prTick); prTick = setInterval(() => { const el = $('#p-elapsed'); if (!el || pr.done) { clearInterval(prTick); return; } el.textContent = prTimeTxt(); }, 1000);
    if (pr.done) return provaResult();
    const q = p.questoes[pr.i], total = p.questoes.length, picked = pr.modo === 'treino' ? pr.picked : (pr.resp[pr.i] ?? null);
    const letters = 'ABCDE';
    const segs = p.questoes.map((_, i) => { const r = pr.resp[i]; let c = ''; if (i === pr.i) c = 'cur'; else if (r !== undefined) c = pr.modo === 'treino' ? (r === p.questoes[i].a ? 'ok' : 'bad') : 'ok'; return `<i class="${c}"></i>`; }).join('');
    const answered = Object.keys(pr.resp).length;
    return `
      <div class="q-head"><span>${pr.i + 1} de ${total} · ${h(p.orgao)}${p.id === 'simulado' ? '' : ' ' + p.ano}</span><span class="row" style="gap:6px">${q.src ? `<span class="chip yellow">${h(q.src.split(' (')[0])}</span>` : ''}<span class="chip">${h(q.disc)}</span></span></div>
      <div class="segments">${segs}</div>
      ${q.texto ? `<details class="acc passage" ${q.texto.length < 700 ? 'open' : ''}><summary>Texto de apoio${ic('chev', 'chev')}</summary><div class="acc-body"><p class="text-2" style="font-size:14.5px;line-height:1.55;margin:0;white-space:pre-line">${h(q.texto)}</p></div></details>` : ''}
      <div class="q-text fade">${h(q.q)}</div>
      ${q.o.map((o, idx) => { let cls = ''; if (pr.modo === 'treino' && picked !== null) { if (idx === q.a) cls = 'correct'; else if (idx === picked) cls = 'wrong'; else cls = 'dim'; } else if (pr.modo === 'prova' && picked === idx) cls = 'correct'; return `<button class="opt ${cls}" data-popt="${idx}" ${pr.modo === 'treino' && picked !== null ? 'disabled' : ''}><span class="letter">${letters[idx]}</span><span>${h(o)}</span></button>`; }).join('')}
      ${pr.modo === 'treino' && picked !== null ? `<div class="explain fade ${picked === q.a ? 'ok' : 'bad'}"><b>${picked === q.a ? 'Certo!' : 'Não é essa.'}</b>${q.e ? h(q.e) : 'Gabarito oficial: ' + letters[q.a] + '.'}</div>` : ''}
      <div class="row" style="margin-top:6px">
        <button class="btn ghost" data-action="p-prev" ${pr.i === 0 ? 'disabled' : ''}>Anterior</button>
        ${pr.modo === 'treino' && picked !== null && picked !== q.a ? `<button class="btn secondary" data-action="p-erro">${ic('note')}Caderno</button>` : ''}
        <button class="btn" style="flex:1" data-action="${pr.i + 1 < total ? 'p-next' : 'p-finish'}">${pr.i + 1 < total ? 'Próxima' : 'Finalizar'}${ic('chevr')}</button>
      </div>
      ${pr.modo === 'prova' ? `<p class="muted" style="font-size:13px;text-align:center;margin-top:12px">${answered}/${total} respondidas · <span id="p-elapsed">${prTimeTxt()}</span>${answered === total ? ` · <a href="#" data-action="p-finish">entregar agora</a>` : ''}</p>` : ''}
    `;
  };
  const provaResult = () => {
    const p = pr.p, total = p.questoes.length;
    const acertos = p.questoes.reduce((n, q, i) => n + (pr.resp[i] === q.a ? 1 : 0), 0);
    if (!pr.saved) {
      pr.saved = true; S.provas = S.provas || {}; const r = S.provas[p.id] || { vezes: 0, best: 0 };
      r.vezes++; r.best = Math.max(r.best, acertos); r.d = todayStr(); S.provas[p.id] = r;
      p.questoes.forEach((q, i) => { if (!q.id || pr.resp[i] === undefined) return; const a = S.answers[q.id] || (S.answers[q.id] = { ok: 0, bad: 0 }); pr.resp[i] === q.a ? a.ok++ : a.bad++; });
      S.quiz.push({ d: new Date().toISOString(), total, correct: acertos, label: p.id === 'simulado' ? 'Simulado completo' : `${p.orgao} ${p.ano} (${pr.modo})`, tag: p.id === 'simulado' ? 'simulado' : 'prova' }); touch();
    }
    const pct = Math.round((acertos / total) * 100), mins = Math.round((Date.now() - pr.start) / 60000);
    const porDisc = {}; p.questoes.forEach((q, i) => { const d = porDisc[q.disc] || (porDisc[q.disc] = { ok: 0, n: 0 }); d.n++; if (pr.resp[i] === q.a) d.ok++; });
    const wrongs = p.questoes.map((q, i) => ({ q, i })).filter(({ q, i }) => pr.resp[i] !== q.a);
    return `
      <div class="card result-big"><div class="eyebrow">${h(p.orgao)} ${p.ano} · ${h(p.cargo)}</div><div class="n">${acertos}<small>/${total}</small></div><div style="margin-top:8px"><span class="chip ${pct >= 70 ? 'ok' : pct >= 50 ? 'yellow' : 'red'}">${pct}% de acerto</span> <span class="chip">${mins} min</span></div></div>
      <div class="card">${Object.entries(porDisc).map(([d, v]) => { const pc = Math.round((v.ok / v.n) * 100); return `<div class="bar-row"><div class="row between"><span>${h(d)}</span><b class="display" style="font-size:15px">${v.ok}/${v.n}</b></div>${progress(pc)}</div>`; }).join('')}</div>
      ${p.id === 'simulado' ? `<div class="callout ${acertos >= 45 ? 'green' : acertos >= 30 ? '' : 'blue'}"><b>${acertos >= 45 ? 'Nível de aprovação' : acertos >= 30 ? 'Acima da nota mínima' : 'Abaixo da nota mínima'}</b>Nota ${(acertos * 1.67).toFixed(1)} pontos. Para passar: 30 acertos (50 pontos). Para a vaga: mirar 45+.</div>` : ''}
      ${wrongs.length ? `<h3>Para revisar (${wrongs.length})</h3>${wrongs.map(({ q, i }) => `<div class="card" style="padding:14px"><div class="eyebrow">Questão ${i + 1} · ${h(q.disc)}</div><div style="font-weight:600;font-size:14.5px;margin-top:4px">${h(q.q)}</div><div class="row" style="gap:6px;margin-top:8px;font-size:13.5px;color:var(--ok-ink)">${ic('check')}<span>${'ABCDE'[q.a]}) ${h(q.o[q.a])}</span></div>${pr.resp[i] !== undefined ? `<div class="muted" style="font-size:13px;margin-top:4px">Você marcou ${'ABCDE'[pr.resp[i]]}</div>` : '<div class="muted" style="font-size:13px;margin-top:4px">Em branco</div>'}${q.e ? `<div class="text-2" style="font-size:13.5px;margin-top:6px">${h(q.e)}</div>` : ''}</div>`).join('')}` : ''}
      <div class="sticky-actions"><a class="btn" style="flex:1" href="#/fazer-prova?id=${p.id}&modo=${pr.modo}&r=${Date.now()}">${p.id === 'simulado' ? 'Novo simulado (outras questões)' : 'Refazer'}</a>${wrongs.length && p.id === 'simulado' ? `<a class="btn secondary" href="#/quiz?mode=erradas&r=${Date.now()}">Refazer erradas</a>` : ''}<a class="btn ghost" href="#/${p.id === 'simulado' ? 'treino' : 'provas'}">Sair</a></div>
    `;
  };


  // ---------- SIMULADOS ----------
  V.simulados = () => `
    ${pageTitle('Simulados', h(D.SIMULADOS.intro))}
    ${D.SIMULADOS.lista.map((s) => { const r = S.sim[s.n]; return `
      <div class="card">
        <div class="row between"><b>Simulado ${s.n} · ${fmtDay(s.data)}</b>${r ? `<span class="chip ${r.acertos >= s.meta ? 'ok' : r.acertos >= 30 ? 'yellow' : 'red'}">${r.acertos}/60</span>` : `<span class="chip outline">meta ${s.meta}+</span>`}</div>
        <p class="text-2" style="font-size:14px">${h(s.desc)}</p>
        <div class="row">
          <input type="number" min="0" max="60" placeholder="Acertos (0 a 60)" id="sim-${s.n}" value="${r ? r.acertos : ''}" style="flex:1">
          <button class="btn sm" data-action="save-sim" data-n="${s.n}" data-meta="${s.meta}">Salvar</button>
        </div>
        ${r ? `<small class="muted">Nota ${(r.acertos * 1.67).toFixed(1)} pontos · ${r.acertos >= 30 ? 'acima da nota mínima' : 'abaixo da nota mínima (30 acertos)'}${r.acertos >= s.meta ? ' · meta batida' : ''}</small>` : ''}
      </div>`; }).join('')}
    <div class="callout">${h(D.SIMULADOS.regras)}</div>
    <a class="btn block" href="#/timer?preset=240">${ic('clock')}Cronômetro de 4 horas</a>
    <h3>Onde pegar provas</h3>
    ${D.SIMULADOS.bancos.map((b) => `<div class="card" style="padding:14px 16px"><div class="card-title" style="font-size:15px">${h(b.n)}</div><p class="text-2" style="margin:0;font-size:14px">${h(b.o)}</p>${links([{ label: 'abrir', url: b.url }])}</div>`).join('')}
  `;

  // ---------- TIMER ----------
  const PRESETS = [
    { l: 'Revisão de ontem', s: 'flashcards ou caderno de erros', m: 10, foco: true }, { l: 'Teoria de Específicos', s: 'videoaula ou PDF em 1,25x', m: 50, foco: true }, { l: 'Pausa', s: 'levantar, água, sem celular', m: 10, foco: false },
    { l: 'Questões de Específicos', s: 'assunto do dia, 20 a 30 questões', m: 40, foco: true }, { l: 'Português ou Legislação', s: 'alternar os dias', m: 30, foco: true }, { l: 'Caderno de erros', s: 'anotar o que errou', m: 10, foco: true },
  ];
  let timer = { running: false, left: 0, total: 0, label: '', foco: true, id: null, idx: -1 };
  const RING_C = 2 * Math.PI * 108;
  const tickTimer = () => {
    if (!timer.running) return;
    timer.left = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
    if (timer.left <= 0) {
      timer.running = false; clearInterval(timer.id); vibrate([200, 100, 200, 100, 400]);
      if (timer.foco) addMinutes(Math.round(timer.total / 60));
      if (timer.idx >= 0) { const t = todayStr(); (S.blocks[t] = S.blocks[t] || []); if (!S.blocks[t].includes(timer.idx)) S.blocks[t].push(timer.idx); save(); }
      toast(timer.foco ? 'Bloco concluído!' : 'Pausa acabou. Bora voltar.');
      notifyNow(timer.foco ? 'Bloco concluído!' : 'Pausa acabou', timer.foco ? 'Faça uma pausa de 10 min ou siga para o próximo bloco.' : 'Hora de voltar a estudar.');
      render(); return;
    }
    const el = $('#timer-left'); if (el) el.textContent = fmtTime(timer.left);
    const arc = $('#timer-arc'); if (arc) arc.setAttribute('stroke-dashoffset', String(RING_C * (1 - timer.left / timer.total)));
  };
  const fmtTime = (s) => { const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60; return hh ? `${hh}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`; };
  const startTimer = (minutes, label, foco, idx = -1) => {
    clearInterval(timer.id);
    timer = { running: true, left: minutes * 60, total: minutes * 60, label, foco, idx, endAt: Date.now() + minutes * 60000 };
    timer.id = setInterval(tickTimer, 500); render();
  };
  V.timer = (params) => {
    const preset = Number(params.get('preset'));
    if (preset && !timer.running && timer.total !== preset * 60) { timer = { ...timer, running: false, left: preset * 60, total: preset * 60, label: preset === 240 ? 'Simulado (4h)' : `${preset} min`, foco: true, idx: -1 }; }
    const done = S.blocks[todayStr()] || [];
    const pct = timer.total ? timer.left / timer.total : 1;
    return `
      ${pageTitle('Timer de estudo')}
      <div class="card" style="text-align:center;padding-top:20px">
        <div class="eyebrow">${h(timer.label || 'Escolha um bloco')}</div>
        <div class="ring">
          <svg width="240" height="240" viewBox="0 0 240 240"><circle cx="120" cy="120" r="108" fill="none" stroke="var(--surface-2)" stroke-width="14"/><circle id="timer-arc" cx="120" cy="120" r="108" fill="none" stroke="${timer.foco ? 'var(--primary)' : 'var(--marker)'}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${RING_C}" stroke-dashoffset="${RING_C * (1 - pct)}" style="transition:stroke-dashoffset .5s linear"/></svg>
          <div class="ring-txt"><div class="t" id="timer-left">${fmtTime(timer.left)}</div><small class="muted">${timer.running ? 'em andamento' : timer.total ? 'pausado' : ''}</small></div>
        </div>
        <div class="row" style="justify-content:center;margin-top:8px">
          ${timer.running ? `<button class="btn secondary" data-action="t-pause">${ic('pause')}Pausar</button>` : timer.total && timer.left > 0 && timer.left < timer.total ? `<button class="btn" data-action="t-resume">${ic('play')}Continuar</button>` : timer.total ? `<button class="btn" data-action="t-start-current">${ic('play')}Iniciar</button>` : ''}
          ${timer.total ? `<button class="btn ghost" data-action="t-reset">${ic('reset')}Zerar</button>` : ''}
        </div>
        <p class="muted" style="font-size:12.5px;margin:14px 0 0">Mantenha o app aberto durante o bloco. Celular em modo foco, longe da mesa.</p>
      </div>
      <div class="section-head"><h3>Blocos do dia útil</h3><small class="muted">150 min</small></div>
      ${PRESETS.map((p, i) => `<div class="tblock ${done.includes(i) ? 'done' : ''}" data-action="t-preset" data-i="${i}"><span class="b-n">${done.includes(i) ? ic('check') : i + 1}</span><div class="b-body"><div class="b-title">${h(p.l)}</div><div class="b-sub">${h(p.s)}${done.includes(i) ? ' · feito hoje' : ''}</div></div><span class="b-min">${p.m}<small style="font-size:11px;font-weight:600;color:var(--muted)"> min</small></span></div>`).join('')}
      <div class="eyebrow" style="margin:18px 0 6px">Outros tempos</div>
      <div class="chips">${[15, 25, 45, 60, 90, 120, 240].map((m) => `<span class="chip outline" data-action="t-custom" data-m="${m}">${m >= 60 ? m / 60 + 'h' : m + ' min'}</span>`).join('')}</div>
      <p class="muted" style="font-size:13.5px">Fim de semana: 2 blocos de teoria + um simulado ou bateria de 30 a 60 questões cronometradas. Hoje você já registrou <b class="text-2">${S.minutes[todayStr()] || 0} min</b> de foco.</p>
    `;
  };

  // ---------- CADERNO DE ERROS ----------
  let erroFiltro = '';
  V.erros = () => {
    const assuntos = [...new Set(S.erros.map((e) => e.assunto))];
    const list = S.erros.filter((e) => !erroFiltro || e.assunto === erroFiltro).slice().reverse();
    return `
      <div class="row between"><h1 class="page-title">Caderno de erros</h1>${S.erros.length ? `<button class="icon-btn" data-action="share-erros" aria-label="Compartilhar">${ic('share')}</button>` : ''}</div>
      <div class="card">
        <div class="eyebrow">Novo erro</div>
        <label class="fl">Assunto</label>
        <input type="text" id="e-assunto" list="assuntos" placeholder="Ex.: Créditos adicionais">
        <datalist id="assuntos">${[...Object.values(D.TAGS), ...assuntos].filter((v, i, a) => a.indexOf(v) === i).map((a) => `<option value="${h(a)}">`).join('')}</datalist>
        <label class="fl">O que confundi</label>
        <textarea id="e-confundi" placeholder="Ex.: achei que crédito especial era reforço de dotação"></textarea>
        <label class="fl">Regra certa</label>
        <textarea id="e-regra" placeholder="Ex.: reforço = suplementar; sem dotação = especial; urgente = extraordinário"></textarea>
        <button class="btn block" data-action="save-erro" style="margin-top:14px">${ic('plus')}Salvar no caderno</button>
      </div>
      <div class="section-head"><h3>${S.erros.length} anotaç${S.erros.length === 1 ? 'ão' : 'ões'}</h3></div>
      ${assuntos.length > 1 ? `<div class="chips scroll"><span class="chip ${!erroFiltro ? 'sel' : ''}" data-action="e-filtro" data-v="">Todos</span>${assuntos.map((a) => `<span class="chip ${erroFiltro === a ? 'sel' : ''}" data-action="e-filtro" data-v="${h(a)}">${h(a)}</span>`).join('')}</div>` : ''}
      ${list.length ? list.map((e) => `<div class="err-item"><div class="e-assunto"><span>${h(e.assunto)}</span><small class="muted">${fmtLong(e.d)}</small></div>${e.confundi ? `<div class="e-row"><b>Confundi</b>${h(e.confundi)}</div>` : ''}<div class="e-row"><b>Regra</b>${h(e.regra)}</div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm ghost" data-action="del-erro" data-id="${e.id}">${ic('trash')}Excluir</button></div></div>`).join('') : `<div class="empty"><span class="tile">${ic('note')}</span><b>Caderno vazio</b>Para cada erro, uma linha: assunto, o que confundi, regra certa. Esse caderno vira o material da última semana.</div>`}
    `;
  };
  const errosTexto = () => 'CADERNO DE ERROS - SSPREV\n\n' + S.erros.map((e) => `[${fmtLong(e.d)}] ${e.assunto}\n  Confundi: ${e.confundi || '-'}\n  Regra: ${e.regra}`).join('\n\n');
  const shareText = async (title, text) => {
    try { if (Plug.Share) { await Plug.Share.share({ title, text, dialogTitle: title }); return; } } catch (e) { }
    try { await navigator.clipboard.writeText(text); toast('Copiado para a área de transferência'); } catch (e) { toast('Não foi possível compartilhar'); }
  };

  // ---------- DIA DA PROVA ----------
  V.prova = () => {
    const sec = (title, arr, key) => `<h3>${title}</h3><div class="card">${arr.map((it, i) => { const k = `${key}:${i}`, done = !!S.checks[k]; return `<div class="check ${done ? 'done' : ''}">${cbox(`data-check="${k}"`, done)}<span>${h(it)}</span></div>`; }).join('')}</div>`;
    const doneN = ['antes', 'levar', 'durante', 'depois'].reduce((n, k) => n + Object.keys(S.checks).filter((c) => c.startsWith(k + ':')).length, 0);
    const totalN = Object.values(D.DIA_PROVA).reduce((n, a) => n + a.length, 0);
    return `
      ${pageTitle('Dia da prova')}
      <div class="hero" style="padding:18px 20px"><div class="eyebrow">${h(D.PROVA.dataTexto)}</div><div class="display" style="font-size:24px;font-weight:700;margin:4px 0">${h(D.PROVA.local)} · 4 horas · 60 questões</div><div class="hero-foot">${progress(Math.round((doneN / totalN) * 100))}<span>${doneN}/${totalN} checados</span></div></div>
      ${sec('Antes', D.DIA_PROVA.antes, 'antes')}
      ${sec('Levar no dia', D.DIA_PROVA.levar, 'levar')}
      ${sec('Na prova', D.DIA_PROVA.durante, 'durante')}
      ${sec('Depois', D.DIA_PROVA.depois, 'depois')}
      ${links([{ label: 'Instituto Mais: local de prova e gabarito', url: D.LEIS.imais }])}
    `;
  };

  V.onde = () => `
    ${pageTitle('Onde estudar', 'Dá para se preparar bem só com material gratuito: vídeos no YouTube, texto das leis no Planalto e questões no Gran Questões. Curso pago é opcional.')}
    ${D.PLATAFORMAS.map((p) => `<div class="card" style="padding:14px 16px"><div class="card-title" style="font-size:15px">${h(p.n)}<span class="chip ${p.custo.startsWith('Grátis') ? 'ok' : ''}" style="margin-left:auto">${h(p.custo.split(',')[0].split(';')[0])}</span></div><p class="text-2" style="margin:0;font-size:14px">${h(p.uso)}</p>${p.url ? links([{ label: 'abrir', url: p.url }]) : ''}</div>`).join('')}
    <div class="callout"><b>Apostila</b>${h(D.DICA_APOSTILA)}</div>
    <h3>Fontes oficiais</h3>
    <div class="card">${D.FONTES.map((f) => `<div class="hist"><span style="font-size:14px">${h(f.label)}</span><button class="link-btn law" data-ext="${h(f.url)}">${ic('ext')}abrir</button></div>`).join('')}</div>
  `;

  V.mais = () => `
    ${pageTitle('Mais')}
    ${listItem('#/erros', 'note', 'yellow', 'Caderno de erros', `${S.erros.length} anotaç${S.erros.length === 1 ? 'ão' : 'ões'}`)}
    ${listItem('#/timer', 'clock', 'blue', 'Timer de estudo', 'Blocos do dia (50/10) e cronômetro de 4h')}
    ${listItem('#/prova', 'bag', 'red', 'Dia da prova', 'Checklist: antes, levar, durante, depois')}
    <div class="eyebrow" style="margin:18px 0 6px">Guia</div>
    ${listItem('#/edital', 'file', '', 'A prova em números', 'Edital, pesos, nota mínima, desempate')}
    ${listItem('#/metodo', 'book', '', 'Como estudar', 'Método, truques de prova, ambiente, divisão do dia')}
    ${listItem('#/onde', 'globe', '', 'Onde estudar', 'Plataformas, texto das leis, fontes oficiais')}
    <div class="eyebrow" style="margin:18px 0 6px">App</div>
    ${listItem('#/config', 'gear', '', 'Configurações', 'Nome, tema, lembrete diário, backup')}
    ${updateCard()}
    <p class="muted" style="text-align:center;font-size:12.5px;margin-top:24px;line-height:1.5">Estuda SSPREV${appInfo ? ' · versão ' + h(appInfo.version) + ' (build ' + h(appInfo.build) + ')' : ' · versão web'}${S.update && appInfo && Number(appInfo.build) >= S.update.versionCode ? ' · atualizado' : ''}<br>${Q.length} questões · ${D.FLASHCARDS.length} flashcards · a partir do Guia de Estudo de 21/10/2026<br>Conteúdo baseado no edital 01/2026. Confira sempre os textos oficiais.</p>
  `;

  V.config = () => `
    ${pageTitle('Configurações')}
    <div class="card">
      <label class="fl" style="margin-top:0">Seu nome</label>
      <input type="text" id="cfg-name" value="${h(S.name)}" placeholder="Como quer ser chamada?">
      <label class="fl">Tema</label>
      <select id="cfg-theme"><option value="auto" ${S.theme === 'auto' ? 'selected' : ''}>Automático (segue o celular)</option><option value="light" ${S.theme === 'light' ? 'selected' : ''}>Claro</option><option value="dark" ${S.theme === 'dark' ? 'selected' : ''}>Escuro</option></select>
      <button class="btn block" data-action="save-cfg" style="margin-top:14px">Salvar</button>
    </div>
    <div class="card">
      <div class="card-title">Lembrete diário</div>
      <div class="switch"><span>Notificação para estudar</span><label class="toggle"><input type="checkbox" id="cfg-rem" ${S.reminder.on ? 'checked' : ''}><span class="tk"></span></label></div>
      <label class="fl">Horário</label>
      <input type="time" id="cfg-rem-time" value="${h(S.reminder.time)}">
      <button class="btn tonal block" data-action="save-rem" style="margin-top:14px">Aplicar lembrete</button>
      <small class="muted" style="display:block;margin-top:8px">${isNative ? 'Também avisa em 13/11 (conferir local de prova) e 21/11 (véspera).' : 'Notificações só funcionam no app instalado no celular.'}</small>
    </div>
    <div class="card">
      <div class="card-title">Backup</div>
      <p class="text-2" style="font-size:14px">Copie o texto para guardar seu progresso ou cole um backup para restaurar.</p>
      <div class="grid2"><button class="btn secondary" data-action="export">${ic('share')}Exportar</button><button class="btn secondary" data-action="import">Importar</button></div>
    </div>
    <div class="card">
      <div class="card-title">Zona de perigo</div>
      <button class="btn danger block" data-action="reset">${ic('trash')}Apagar todo o progresso</button>
    </div>
  `;

  // ---------- notificações ----------
  const notifyNow = async (title, body) => {
    try { if (!Plug.LocalNotifications) return; await Plug.LocalNotifications.schedule({ notifications: [{ id: 9000 + Math.floor(Math.random() * 999), title, body, schedule: { at: new Date(Date.now() + 500) } }] }); } catch (e) { }
  };
  const applyReminder = async () => {
    const LN = Plug.LocalNotifications; if (!LN) { toast('Lembretes só no app instalado'); return; }
    try {
      await LN.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });
      if (!S.reminder.on) { toast('Lembrete desativado'); return; }
      let perm = await LN.checkPermissions(); if (perm.display !== 'granted') perm = await LN.requestPermissions();
      if (perm.display !== 'granted') { toast('Permissão de notificação negada'); return; }
      const [hh, mm] = S.reminder.time.split(':').map(Number);
      await LN.schedule({ notifications: [
        { id: 1, title: 'Hora de estudar', body: 'Seu bloco de hoje está esperando. Faltam poucos dias para a prova.', schedule: { on: { hour: hh, minute: mm }, allowWhileIdle: true } },
        { id: 2, title: 'Conferir local de prova', body: 'Hoje saem os locais de prova no site do Instituto Mais e no DOEM.', schedule: { at: new Date(2026, 10, 13, 10, 0), allowWhileIdle: true } },
        { id: 3, title: 'Véspera da prova', body: 'Revisão leve de manhã, descanso à tarde. Separe documento com foto e 2 canetas transparentes.', schedule: { at: new Date(2026, 10, 21, 9, 0), allowWhileIdle: true } },
      ] });
      toast(`Lembrete diário às ${S.reminder.time}`);
    } catch (e) { toast('Erro ao agendar lembrete'); }
  };

  // ---------- modal ----------
  const modal = (html) => { $('#modal-card').innerHTML = html; $('#modal').hidden = false; };
  const closeModal = () => { $('#modal').hidden = true; };
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  // ---------- roteamento ----------
  const ROUTES = {
    '': { v: 'home', t: 'Estuda SSPREV', tab: 'home' }, 'plano': { v: 'plano', t: 'Plano de estudos', tab: 'plano' },
    'metodo': { v: 'metodo', t: 'Como estudar', tab: 'plano', back: true }, 'edital': { v: 'edital', t: 'A prova em números', tab: 'home', back: true },
    'materias': { v: 'materias', t: 'Matérias', tab: 'materias' }, 'materias/esp': { v: 'esp', t: 'Conhecimentos Específicos', tab: 'materias', back: true },
    'materias/port': { v: 'port', t: 'Língua Portuguesa', tab: 'materias', back: true }, 'materias/leg': { v: 'leg', t: 'Legislação Municipal', tab: 'materias', back: true },
    'treino': { v: 'treino', t: 'Treino', tab: 'treino' }, 'quiz': { v: 'quiz', t: 'Quiz', tab: 'treino', back: true }, 'flash': { v: 'flash', t: 'Flashcards', tab: 'treino', back: true },
    'simulados': { v: 'simulados', t: 'Simulados', tab: 'treino', back: true }, 'provas': { v: 'provas', t: 'Provas da banca', tab: 'treino', back: true }, 'fazer-prova': { v: 'fazerProva', t: 'Prova', tab: 'treino', back: true }, 'historico': { v: 'historico', t: 'Histórico', tab: 'treino', back: true },
    'mais': { v: 'mais', t: 'Mais', tab: 'mais' }, 'erros': { v: 'erros', t: 'Caderno de erros', tab: 'mais', back: true }, 'timer': { v: 'timer', t: 'Timer de estudo', tab: 'mais', back: true },
    'prova': { v: 'prova', t: 'Dia da prova', tab: 'mais', back: true }, 'onde': { v: 'onde', t: 'Onde estudar', tab: 'mais', back: true }, 'config': { v: 'config', t: 'Configurações', tab: 'mais', back: true },
  };
  let current = { path: '', params: new URLSearchParams() };
  const parseHash = () => { const hsh = location.hash.replace(/^#\/?/, ''); const [path, qs] = hsh.split('?'); return { path: path || '', params: new URLSearchParams(qs || '') }; };
  const syncTopbar = () => topbar.classList.toggle('scrolled', current.path === 'quiz' || current.path === 'flash' || window.scrollY > 40);
  const render = () => {
    const r = ROUTES[current.path] || ROUTES[''];
    titleEl.textContent = r.t; backBtn.hidden = !r.back;
    syncTopbar();
    $$('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === r.tab));
    view.innerHTML = `<div class="fade">${V[r.v](current.params)}</div>`;
  };
  const onRoute = () => { const next = parseHash(); if (next.path !== current.path) { window.scrollTo(0, 0); if (next.path !== 'fazer-prova' && typeof prTick !== 'undefined') clearInterval(prTick); } current = next; render(); };
  window.addEventListener('hashchange', onRoute);
  window.addEventListener('scroll', syncTopbar, { passive: true });
  backBtn.onclick = () => history.length > 1 ? history.back() : (location.hash = '#/');

  // ---------- eventos (delegação) ----------
  document.addEventListener('click', (e) => {
    const ext = e.target.closest('[data-ext]'); if (ext) { e.preventDefault(); openUrl(ext.dataset.ext); return; }
    const opt = e.target.closest('[data-opt]'); if (opt && quiz && !opt.disabled) { pickOption(Number(opt.dataset.opt)); return; }
    const popt = e.target.closest('[data-popt]'); if (popt && pr && !popt.disabled) { const idx = Number(popt.dataset.popt); pr.resp[pr.i] = idx; if (pr.modo === 'treino') { pr.picked = idx; vibrate(idx === pr.p.questoes[pr.i].a ? 15 : [40, 40, 40]); } touch(); render(); return; }
    const el = e.target.closest('[data-action]'); if (!el) return;
    const a = el.dataset.action;
    if (a === 'next') { quiz.i++; quiz.picked = null; render(); window.scrollTo(0, 0); }
    else if (a === 'p-next') { pr.i++; pr.picked = pr.modo === 'treino' ? null : pr.picked; render(); window.scrollTo(0, 0); }
    else if (a === 'p-prev') { pr.i = Math.max(0, pr.i - 1); pr.picked = pr.modo === 'treino' ? (pr.resp[pr.i] ?? null) : null; render(); window.scrollTo(0, 0); }
    else if (a === 'p-finish') { e.preventDefault(); const total = pr.p.questoes.length, answered = Object.keys(pr.resp).length; if (pr.modo === 'prova' && answered < total && !confirm(`Ainda faltam ${total - answered} questões. Entregar mesmo assim?`)) return; pr.done = true; render(); window.scrollTo(0, 0); }
    else if (a === 'p-erro') { const q = pr.p.questoes[pr.i]; S.erros.push({ id: 'e' + Date.now(), assunto: q.disc, confundi: `Marquei "${q.o[pr.picked]}" em: ${q.q}`, regra: `Gabarito: ${q.o[q.a]} (${pr.p.orgao} ${pr.p.ano}, questão ${pr.i + 1})`, d: todayStr() }); touch(); toast('Anotado no caderno de erros'); el.disabled = true; el.innerHTML = `${ic('check')}No caderno`; }
    else if (a === 'add-erro') { const q = Q.find((x) => x.id === el.dataset.qid); const picked = quiz.picked; S.erros.push({ id: 'e' + Date.now(), assunto: D.TAGS[q.t], confundi: `Marquei "${q.o[picked]}" em: ${q.q}`, regra: `${q.o[q.a]} — ${q.e}`, d: todayStr() }); touch(); toast('Anotado no caderno de erros'); el.disabled = true; el.innerHTML = `${ic('check')}No caderno`; }
    else if (a === 'flip') { fc.flipped = !fc.flipped; render(); }
    else if (a === 'fc-ok') fcAnswer(true);
    else if (a === 'fc-bad') fcAnswer(false);
    else if (a === 'fc-all') { e.preventDefault(); fc = { key: 'fc:all', queue: shuffle(D.FLASHCARDS).slice(0, 25), flipped: false, done: 0, hits: 0, requeued: 0 }; render(); }
    else if (a === 'save-sim') { const n = el.dataset.n, v = Number($('#sim-' + n).value); if (isNaN(v) || v < 0 || v > 60 || $('#sim-' + n).value === '') { toast('Digite um valor de 0 a 60'); return; } S.sim[n] = { acertos: v, d: todayStr() }; touch(); toast(v >= Number(el.dataset.meta) ? 'Meta batida!' : 'Resultado salvo'); render(); }
    else if (a === 't-preset') { const p = PRESETS[Number(el.dataset.i)]; startTimer(p.m, p.l, p.foco, Number(el.dataset.i)); window.scrollTo(0, 0); }
    else if (a === 't-custom') { const m = Number(el.dataset.m); startTimer(m, m === 240 ? 'Simulado (4h)' : `Bloco de ${m} min`, true); window.scrollTo(0, 0); }
    else if (a === 't-start-current') { startTimer(timer.total / 60, timer.label, timer.foco, timer.idx); }
    else if (a === 't-pause') { timer.running = false; clearInterval(timer.id); render(); }
    else if (a === 't-resume') { timer.running = true; timer.endAt = Date.now() + timer.left * 1000; timer.id = setInterval(tickTimer, 500); render(); }
    else if (a === 't-reset') { clearInterval(timer.id); timer = { running: false, left: 0, total: 0, label: '', foco: true, id: null, idx: -1 }; render(); }
    else if (a === 'save-erro') { const assunto = $('#e-assunto').value.trim(), confundi = $('#e-confundi').value.trim(), regra = $('#e-regra').value.trim(); if (!assunto || !regra) { toast('Preencha assunto e regra certa'); return; } S.erros.push({ id: 'e' + Date.now(), assunto, confundi, regra, d: todayStr() }); touch(); toast('Salvo no caderno'); render(); }
    else if (a === 'del-erro') { S.erros = S.erros.filter((x) => x.id !== el.dataset.id); save(); render(); }
    else if (a === 'e-filtro') { erroFiltro = el.dataset.v; render(); }
    else if (a === 'share-erros') shareText('Caderno de erros', errosTexto());
    else if (a === 'save-cfg') { S.name = $('#cfg-name').value.trim(); S.theme = $('#cfg-theme').value; save(); applyTheme(); toast('Salvo'); }
    else if (a === 'save-rem') { S.reminder = { on: $('#cfg-rem').checked, time: $('#cfg-rem-time').value || '19:30' }; save(); applyReminder(); }
    else if (a === 'export') { const txt = JSON.stringify(S); modal(`<h3>Backup</h3><p class="text-2" style="font-size:14px">Copie e guarde este texto, ou compartilhe para você mesma.</p><textarea id="bk" style="min-height:120px;font-size:11px">${h(txt)}</textarea><div class="grid2" style="margin-top:12px"><button class="btn secondary" data-action="copy-bk">Copiar</button><button class="btn" data-action="share-bk">${ic('share')}Compartilhar</button></div>`); }
    else if (a === 'copy-bk') { navigator.clipboard.writeText($('#bk').value).then(() => toast('Copiado')).catch(() => toast('Selecione e copie manualmente')); }
    else if (a === 'share-bk') shareText('Backup Estuda SSPREV', $('#bk').value);
    else if (a === 'import') { modal(`<h3>Importar backup</h3><textarea id="bk-in" placeholder="Cole aqui o texto do backup" style="min-height:120px"></textarea><button class="btn block" data-action="do-import" style="margin-top:12px">Restaurar</button>`); }
    else if (a === 'do-import') { try { const o = JSON.parse($('#bk-in').value); if (!o || typeof o !== 'object' || !o.tasks) throw 0; S = { ...defaults(), ...o }; save(); applyTheme(); closeModal(); toast('Progresso restaurado'); render(); } catch (err) { toast('Backup inválido'); } }
    else if (a === 'reset') { modal(`<h3>Apagar tudo?</h3><p class="text-2">Isso remove tarefas marcadas, quizzes, flashcards, simulados e o caderno de erros. Não dá para desfazer.</p><div class="grid2"><button class="btn secondary" data-action="close-modal">Cancelar</button><button class="btn danger" data-action="do-reset">Apagar</button></div>`); }
    else if (a === 'do-reset') { S = defaults(); save(); applyTheme(); closeModal(); toast('Progresso apagado'); render(); }
    else if (a === 'close-modal') closeModal();
    else if (a === 'upd-open') { if (S.update && S.update.apkUrl) openUrl(S.update.apkUrl); }
    else if (a === 'upd-later') { S.update.dismissed = S.update.versionCode; save(); render(); }
    else if (a === 'first-save') { S.name = ($('#first-name').value || '').trim(); save(); closeModal(); render(); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.task) {
      if (t.checked) S.tasks[t.dataset.task] = true; else delete S.tasks[t.dataset.task]; touch();
      const row = t.closest('.task'); row && row.classList.toggle('done', t.checked);
      if (t.checked) { vibrate(20); toast(['Boa!', 'Mais uma.', 'Constância vence.', 'Isso aí.'][Math.floor(Math.random() * 4)]); }
      const ts = taskStats(); $$('.hero .progress > div').forEach((b) => (b.style.width = ts.pct + '%'));
    }
    if (t.dataset.check) { if (t.checked) S.checks[t.dataset.check] = true; else delete S.checks[t.dataset.check]; save(); const row = t.closest('.check'); row && row.classList.toggle('done', t.checked); if (t.checked) vibrate(15); }
  });

  // ---------- Capacitor: botão voltar ----------
  if (Plug.App && Plug.App.addListener) {
    Plug.App.addListener('backButton', () => {
      if (!$('#modal').hidden) { closeModal(); return; }
      const r = ROUTES[current.path] || ROUTES[''];
      if (r.back || current.path !== '') { if (r.back) history.back(); else location.hash = '#/'; }
      else { try { Plug.App.minimizeApp(); } catch (e) { Plug.App.exitApp(); } }
    });
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && timer.running) tickTimer(); });

  // ---------- atualizações (GitHub) ----------
  // version.json avisa que há APK novo; extra.json traz questões/flashcards novos sem reinstalar.
  const REPO = 'alexsynvia/estuda-ssprev';
  const RAW = `https://raw.githubusercontent.com/${REPO}/main/release/`;
  let appInfo = null; // { version, build } no app instalado; null na web
  const mergeExtra = (extra) => {
    if (!extra || typeof extra !== 'object') return 0;
    let n = 0;
    (extra.questoes || []).forEach((q, i) => { const id = 'x' + i; if (!q || !q.q || !Array.isArray(q.o) || Q.some((x) => x.id === id)) return; Q.push({ id, src: q.src || 'Atualização de conteúdo', ...q }); n++; });
    (extra.flashcards || []).forEach((c, i) => { const id = 'xf' + i; if (!c || !c.f || D.FLASHCARDS.some((x) => x.id === id)) return; D.FLASHCARDS.push({ id, tag: c.tag || 'cpub', f: c.f, v: c.v }); n++; });
    return n;
  };
  try { const cached = localStorage.getItem('ssprev_extra'); if (cached) mergeExtra(JSON.parse(cached)); } catch (e) { }
  const fetchJson = async (name) => { const r = await fetch(RAW + name + '?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); };
  const syncRemote = async () => {
    if (navigator.onLine === false) return;
    try { // conteúdo extra
      const extra = await fetchJson('extra.json'); const txt = JSON.stringify(extra);
      if (txt !== localStorage.getItem('ssprev_extra')) { localStorage.setItem('ssprev_extra', txt); const n = mergeExtra(extra); if (n) { toast(`Conteúdo atualizado: +${n} itens`); render(); } }
    } catch (e) { }
    try { // nova versão do APK (só faz sentido no app instalado)
      if (Plug.App && Plug.App.getInfo) { appInfo = await Plug.App.getInfo(); }
      const v = await fetchJson('version.json');
      S.update = { versionName: v.versionName, versionCode: Number(v.versionCode), notes: v.notes || '', apkUrl: v.apkUrl, date: v.date }; save();
      if (current.path === '' || current.path === 'mais' || current.path === 'config') render();
    } catch (e) { }
  };
  const updateAvailable = () => S.update && appInfo && Number(appInfo.build) < S.update.versionCode && S.update.dismissed !== S.update.versionCode;
  const updateCard = () => updateAvailable() ? `
      <div class="card" style="border-left:4px solid var(--marker)">
        <div class="row between" style="align-items:flex-start"><div><div class="eyebrow">Atualização disponível</div><b style="font-size:16px">Estuda SSPREV ${h(S.update.versionName)}</b><p class="text-2" style="margin:4px 0 0;font-size:14px">${h(S.update.notes)}</p></div></div>
        <div class="grid2" style="margin-top:12px"><button class="btn" data-action="upd-open">${ic('ext')}Baixar e instalar</button><button class="btn ghost" data-action="upd-later">Depois</button></div>
        <small class="muted" style="display:block;margin-top:8px">Ao abrir o arquivo baixado, toque em Instalar. Seu progresso é mantido.</small>
      </div>` : '';

  // ---------- início ----------
  applyTheme();
  if (!location.hash) location.hash = '#/';
  current = parseHash(); render();
  syncRemote(); window.addEventListener('online', syncRemote);
  if (!S.name && !S._asked) { S._asked = true; save(); setTimeout(() => modal(`<h3>Bem-vinda</h3><p class="text-2">Este app reúne o guia de estudo para o concurso do SSPREV: cronograma dia a dia, resumos, ${Q.length} questões comentadas, ${D.FLASHCARDS.length} flashcards, timer e caderno de erros. Tudo offline.</p><label class="fl">Como quer ser chamada?</label><input type="text" id="first-name" placeholder="Seu nome"><button class="btn block" data-action="first-save" style="margin-top:14px">Começar</button>`), 400); }
})();
