import { spawn } from 'child_process';
import path from 'path';
import http from 'http';
import fs from 'fs';

const PORT = 8126;
const ROOT = path.resolve('.');
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tmpProfile = path.join(ROOT, '.tmp_edge_profile_moon');
  if (fs.existsSync(tmpProfile)) {
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }

  const edge = spawn(edgePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    '--remote-debugging-port=9224',
    '--window-size=1920,1080',
    `http://localhost:${PORT}/index.html`
  ]);

  let targetWsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const resp = await fetch('http://127.0.0.1:9224/json/list');
      const list = await resp.json();
      const page = list.find(item => item.type === 'page' && item.url.includes(`localhost:${PORT}`));
      if (page && page.webSocketDebuggerUrl) {
        targetWsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  const ws = new WebSocket(targetWsUrl);
  let msgId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await cdp('Page.enable');
  await new Promise(r => setTimeout(r, 2000));

  // Capture header brand area
  const clip = { x: 0, y: 0, width: 450, height: 90, scale: 2 };
  const snap = await cdp('Page.captureScreenshot', { format: 'png', clip });
  fs.writeFileSync('tests/verify_moon_header.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved tests/verify_moon_header.png');

  ws.close();
  edge.kill();
  server.close();
  try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
});
