import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 3000);
const clients = new Set();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const reloadScript = `<script>(()=>{const events=new EventSource('/__live/events');let connected=false;events.addEventListener('ready',()=>{if(connected)location.reload();connected=true});events.addEventListener('change',()=>location.reload());})();</script>`;

function allowed(relative) {
  return relative === 'index.html' || relative === 'style.css' || relative === 'app.js' || relative.startsWith('assets/');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname === '/__live/events' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
    res.write('event: ready\ndata: connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (relative.split(/[\\/]/).some(part => part.startsWith('.')) || !allowed(relative)) {
    res.writeHead(404).end('Not found'); return;
  }
  try {
    const filename = await realpath(path.resolve(root, relative));
    const withinRoot = path.relative(root, filename);
    if (withinRoot.startsWith('..') || path.isAbsolute(withinRoot) || !(await stat(filename)).isFile()) {
      res.writeHead(404).end('Not found'); return;
    }
    let content = await readFile(filename);
    if (path.extname(filename) === '.html') content = Buffer.from(content.toString().replace('</body>', reloadScript + '</body>'));
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Content-Length': content.length });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(404).end('Not found'); }
});

let timer;
const watcher = watch(root, { recursive: true }, (_event, name) => {
  if (!name || !allowed(String(name).split(path.sep).join('/'))) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const client of clients) client.write('event: change\ndata: reload\n\n');
  }, 150);
});
watcher.on('error', error => console.error('File watcher:', error.message));
const heartbeat = setInterval(() => { for (const client of clients) client.write(': keepalive\n\n'); }, 20000);
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Stop its server or choose another PORT.` : error.message);
  watcher.close(); clearInterval(heartbeat); process.exitCode = 1;
});
server.listen(port, '0.0.0.0', () => console.log(`Nardoon live development server: http://localhost:${port}\nWatching HTML, CSS, JavaScript and assets for automatic reload.`));
function stop() {
  watcher.close(); clearInterval(heartbeat); clearTimeout(timer);
  for (const client of clients) client.end();
  server.close();
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
