import http from 'node:http';
import { readFile, stat, realpath, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 3002);
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

// Recursive fs.watch is unavailable on Linux with Node 18. Poll only the
// served files so live reload also handles new directories and renamed files.
async function snapshot() {
  const entries = [];
  async function scan(relative) {
    try {
      const filename = path.join(root, relative);
      const info = await stat(filename);
      if (info.isDirectory()) {
        for (const entry of await readdir(filename, { withFileTypes: true })) {
          if (!entry.isSymbolicLink() && !entry.name.startsWith('.')) await scan(path.join(relative, entry.name));
        }
      } else if (info.isFile()) entries.push(`${relative}:${info.mtimeMs}:${info.ctimeMs}:${info.size}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  for (const relative of ['index.html', 'style.css', 'app.js', 'assets']) await scan(relative);
  return entries.sort().join('\n');
}
let signature = await snapshot();
let polling = false;
const poller = setInterval(async () => {
  if (polling) return;
  polling = true;
  try {
    const next = await snapshot();
    if (next !== signature) {
      signature = next;
      for (const client of clients) client.write('event: change\ndata: reload\n\n');
    }
  } catch (error) { console.error('File polling:', error.message); }
  finally { polling = false; }
}, 750);
const heartbeat = setInterval(() => { for (const client of clients) client.write(': keepalive\n\n'); }, 20000);
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Stop its server or choose another PORT.` : error.message);
  clearInterval(poller); clearInterval(heartbeat); process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Daya live development server: http://localhost:${port}\nWatching HTML, CSS, JavaScript and assets for automatic reload.`));
function stop() {
  clearInterval(poller); clearInterval(heartbeat);
  for (const client of clients) client.end();
  server.close();
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
