// Renderiza todas as telas com jsdom para pegar erros de runtime
const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('www/index.html', 'utf8').replace(/<script src="[^"]+"><\/script>/g, '');
const dom = new JSDOM(html, { url: 'http://localhost/#/', pretendToBeVisual: true, runScripts: 'outside-only' });
const w = dom.window;
w.matchMedia = () => ({ matches: false, addEventListener() {} });
w.navigator.vibrate = () => true; w.scrollTo = () => {};
w.localStorage.clear();
const run = (f) => w.eval(fs.readFileSync(f, 'utf8'));
run('www/js/data.js'); run('www/js/questions.js'); run('www/js/questions2.js'); run('www/js/questions3.js'); run('www/js/provas.js'); run('www/js/app.js');
const routes = ['', 'plano', 'metodo', 'edital', 'materias', 'materias/esp', 'materias/port', 'materias/leg', 'treino', 'quiz?mode=rapido', 'quiz?mode=mini', 'quiz?mode=erradas', 'quiz?tag=esp', 'quiz?tag=port', 'flash', 'flash?tag=esp', 'flash?tag=lrf', 'simulados', 'historico', 'mais', 'erros', 'timer', 'timer?preset=240', 'prova', 'provas', 'fazer-prova?id=simulado&modo=prova', 'onde', 'config'];
let fails = 0;
for (const r of routes) {
  try {
    w.location.hash = '#/' + r;
    w.dispatchEvent(new w.Event('hashchange'));
    const len = w.document.getElementById('view').innerHTML.length;
    if (len < 150) throw new Error('view vazia (' + len + ')');
    console.log('OK  ', r.padEnd(22), len);
  } catch (e) { fails++; console.log('FAIL', r, e.message); }
}
// fluxo do quiz: responde todas
w.location.hash = '#/quiz?mode=rapido&r=1'; w.dispatchEvent(new w.Event('hashchange'));
for (let i = 0; i < 10; i++) {
  const opt = w.document.querySelector('.opt'); if (!opt) break;
  opt.click();
  const add = w.document.querySelector('[data-action="add-erro"]'); if (add) add.click();
  const next = w.document.querySelector('[data-action="next"]'); next && next.click();
}
console.log('quiz result?', /de acerto/.test(w.document.getElementById('view').innerHTML));
// flashcards: vira e responde 3
w.location.hash = '#/flash?r=2'; w.dispatchEvent(new w.Event('hashchange'));
for (let i = 0; i < 3; i++) { w.document.querySelector('[data-action="flip"]').click(); w.document.querySelector('[data-action="fc-ok"]').click(); }
console.log('fc ok', /\d+ de \d+/.test(w.document.getElementById('view').innerHTML));
// tarefa
w.location.hash = '#/plano'; w.dispatchEvent(new w.Event('hashchange'));
const cb = w.document.querySelector('input[data-task]'); cb.checked = true; cb.dispatchEvent(new w.Event('change', { bubbles: true }));
const saved = JSON.parse(w.localStorage.getItem('ssprev_v1'));
console.log('saved tasks', Object.keys(saved.tasks).length, 'erros', saved.erros.length, 'quiz', saved.quiz.length);
// home após dados
w.location.hash = '#/'; w.dispatchEvent(new w.Event('hashchange'));
console.log('home ok', w.document.getElementById('view').innerHTML.length);
process.exit(fails ? 1 : 0);
