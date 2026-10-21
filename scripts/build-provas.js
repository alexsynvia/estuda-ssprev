// Junta data/provas/*.json em www/js/provas.js (carregado pelo app). Uso: node scripts/build-provas.js
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'provas');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
const provas = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
provas.sort((a, b) => (b.ano || 0) - (a.ano || 0) || a.titulo.localeCompare(b.titulo));
const header = `/* Provas reais da banca Instituto Mais (questões públicas de concursos anteriores, gabarito oficial).
   Gerado por scripts/build-provas.js a partir de data/provas/*.json — não editar à mão.
   Formato: { id, titulo, orgao, ano, nivel, cargo, fonte, alternativas, questoes: [{ n, disc, q, o: [...], a, texto? }] } */\n`;
fs.writeFileSync(path.join(__dirname, '..', 'www', 'js', 'provas.js'), header + 'window.PROVAS = ' + JSON.stringify(provas) + ';\n', 'utf8');
console.log(`${provas.length} prova(s), ${provas.reduce((n, p) => n + p.questoes.length, 0)} questões -> www/js/provas.js`);
provas.forEach((p) => console.log(` - ${p.id}: ${p.titulo} (${p.questoes.length} q)`));
