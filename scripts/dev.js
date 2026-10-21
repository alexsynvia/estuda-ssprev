// Servidor local de desenvolvimento: serve www/ e recarrega o navegador quando um arquivo muda.
// Uso: npm run dev  (ou duplo clique em dev.bat). Abre http://localhost:5173
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = path.join(__dirname, '..', 'www');
const PORT = Number(process.env.PORT) || 5173;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const RELOAD = `<script>addEventListener('load',()=>{const es=new EventSource('/__reload');es.onmessage=(e)=>{if(e.data==='reload')location.reload();};});</script>`;

const clients = new Set();
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(': conectado\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  let file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404 ' + url); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    if (ext === '.html') data = Buffer.from(data.toString('utf8').replace('</body>', RELOAD + '</body>'));
    res.end(data);
  });
});

let t;
fs.watch(ROOT, { recursive: true }, (ev, name) => {
  clearTimeout(t);
  t = setTimeout(() => { console.log(`[${new Date().toLocaleTimeString()}] ${name || 'arquivo'} mudou, recarregando`); for (const c of clients) c.write('data: reload\n\n'); }, 150);
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`Estuda SSPREV rodando em ${url}`);
  console.log('Dica: F12 > ícone de celular (Ctrl+Shift+M) para ver no tamanho de um Android. Ctrl+C para parar.');
  if (!process.argv.includes('--no-open')) exec(`start "" "${url}"`);
});
