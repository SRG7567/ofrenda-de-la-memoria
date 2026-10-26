import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 8125;
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
  const tmpProfile = path.join(ROOT, '.tmp_edge_profile_bg');
  if (fs.existsSync(tmpProfile)) {
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }

  const edge = spawn(edgePath, [
    '--headless=new',
    `--user-data-dir=${tmpProfile}`,
    '--remote-debugging-port=9223',
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
      const resp = await fetch('http://127.0.0.1:9223/json/list');
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
  console.log('WebSocket open, enabling domains...');

  await cdp('Page.enable');
  await cdp('Runtime.enable');

  // Wait for font loading and tree layout
  await new Promise(r => setTimeout(r, 2200));

  // Inspect DOM and styles of background effects
  const evalResult = await cdp('Runtime.evaluate', {
    expression: `
      (() => {
        const wrapper = document.querySelector('.bg-stage-wrapper');
        const frame = document.querySelector('.bg-stage-frame');
        const content = document.querySelector('.bg-stage-content');
        const stars = document.querySelectorAll('.bg-star');
        const moon = document.querySelector('.bg-moon-halo');
        const smoke = document.querySelectorAll('.smoke-ribbon');
        const sparkles = document.querySelectorAll('.bg-candle-sparkle');
        const petals = document.querySelectorAll('.bg-petal');
        
        const frameRect = frame ? frame.getBoundingClientRect() : null;
        const contentStyle = content ? window.getComputedStyle(content) : null;
        
        return {
          wrapperExists: !!wrapper,
          frameExists: !!frame,
          frameAspect: frameRect ? (frameRect.width / frameRect.height).toFixed(4) : null,
          frameWidth: frameRect ? frameRect.width : 0,
          frameHeight: frameRect ? frameRect.height : 0,
          breathingAnimation: contentStyle ? contentStyle.animationName : null,
          starsCount: stars.length,
          moonExists: !!moon,
          smokeRibbonsCount: smoke.length,
          sparklesCount: sparkles.length,
          petalsCount: petals.length,
          petalsOutsideCenter: Array.from(petals).every(p => {
            const leftPct = parseFloat(p.style.left || window.getComputedStyle(p).left);
            // check className or left
            const cl = p.className;
            return cl.includes('petal-l') || cl.includes('petal-r');
          })
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Background Elements Audit:', evalResult.value);

  // 1. Screenshot: "Ver todo" a pantalla completa (1920x1080)
  console.log('1. Capturing: Ver todo a pantalla completa (1920x1080)');
  let snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_bg_fullscreen.png', Buffer.from(snap.data, 'base64'));

  // 2. Vista de celular (390x844, iPhone standard)
  console.log('2. Emulating mobile viewport (390x844) and capturing: Vista celular');
  await cdp('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Trigger resize and tree fitting
  await cdp('Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new Event('resize'));
      if (window.appInstance) {
        window.appInstance.fitToBox(false);
      }
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const mobileEval = await cdp('Runtime.evaluate', {
    expression: `
      (() => {
        const frame = document.querySelector('.bg-stage-frame');
        const frameRect = frame ? frame.getBoundingClientRect() : null;
        return {
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          frameWidth: frameRect ? frameRect.width : 0,
          frameHeight: frameRect ? frameRect.height : 0,
          frameAspect: frameRect ? (frameRect.width / frameRect.height).toFixed(4) : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Mobile Metrics Audit:', mobileEval.value);

  snap = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('tests/verify_bg_mobile.png', Buffer.from(snap.data, 'base64'));

  console.log('Verification completed successfully! Closing...');
  ws.close();
  edge.kill();
  server.close();
  try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
});
