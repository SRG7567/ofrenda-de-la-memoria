import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8124;
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
  const mime = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tmpProfile = path.join(ROOT, '.tmp_edge_profile');
  if (fs.existsSync(tmpProfile)) {
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }

  const edge = spawn(edgePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    '--remote-debugging-port=9222',
    '--window-size=1920,1080',
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-sandbox',
    `http://localhost:${PORT}/index.html`
  ]);

  let targetWsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const resp = await fetch('http://127.0.0.1:9222/json/list');
      const list = await resp.json();
      const page = list.find(item => item.type === 'page' && item.url.includes(`localhost:${PORT}`));
      if (page && page.webSocketDebuggerUrl) {
        targetWsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!targetWsUrl) {
    console.error('Failed to locate target page on CDP');
    edge.kill();
    server.close();
    process.exit(1);
  }

  console.log('Connected to target page WebSocket:', targetWsUrl);
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
  console.log('WebSocket open, setting up page...');

  await cdp('Page.enable');
  await cdp('Runtime.enable');

  // Allow layout and font rendering
  await new Promise(r => setTimeout(r, 2000));

  // 1. Screenshot: "Ver todo"
  console.log('1. Capturing: Ver todo');
  let snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_1_ver_todo.png', Buffer.from(snap.data, 'base64'));

  // 2. Zoom fuerte sobre vela viva (P044 Sofía)
  console.log('2. Capturing: Zoom fuerte vela viva (Sofía P044)');
  await cdp('Runtime.evaluate', {
    expression: `
      (() => {
        const node = document.getElementById('node-P044');
        if (node) {
          const transform = node.getAttribute('transform');
          const m = transform.match(/translate\\(([^,]+),\\s*([^\\)]+)\\)/);
          if (m) {
            const nx = parseFloat(m[1]);
            const ny = parseFloat(m[2]);
            const scale = 3.4;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const tx = cx - nx * scale;
            const ty = cy - ny * scale;
            const vp = document.getElementById('viewport-group');
            vp.setAttribute('transform', \`translate(\${tx}, \${ty}) scale(\${scale})\`);
          }
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));
  snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_2_zoom_viva.png', Buffer.from(snap.data, 'base64'));

  // 3. Zoom fuerte sobre vela apagada (P007 Gonzalo)
  console.log('3. Capturing: Zoom fuerte vela apagada (Gonzalo P007)');
  await cdp('Runtime.evaluate', {
    expression: `
      (() => {
        const node = document.getElementById('node-P007');
        if (node) {
          const transform = node.getAttribute('transform');
          const m = transform.match(/translate\\(([^,]+),\\s*([^\\)]+)\\)/);
          if (m) {
            const nx = parseFloat(m[1]);
            const ny = parseFloat(m[2]);
            const scale = 3.4;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const tx = cx - nx * scale;
            const ty = cy - ny * scale;
            const vp = document.getElementById('viewport-group');
            vp.setAttribute('transform', \`translate(\${tx}, \${ty}) scale(\${scale})\`);
          }
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));
  snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_3_zoom_apagada.png', Buffer.from(snap.data, 'base64'));

  // 4. Filtro de fallecidos activo
  console.log('4. Capturing: Filtro de fallecidos activo');
  await cdp('Runtime.evaluate', {
    expression: `
      (() => {
        const btnReset = document.getElementById('btn-reset-view');
        if (btnReset) btnReset.click();

        const filterStatus = document.getElementById('filter-status');
        if (filterStatus) {
          filterStatus.value = 'deceased';
          filterStatus.dispatchEvent(new Event('change'));
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));
  snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_4_filtro_fallecidos.png', Buffer.from(snap.data, 'base64'));

  console.log('All 4 verifications captured successfully!');
  ws.close();
  edge.kill();
  server.close();
  try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
});
