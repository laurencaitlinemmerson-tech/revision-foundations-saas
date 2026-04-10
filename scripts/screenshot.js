const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const http = require('http');

const outDir = path.resolve(__dirname, '..', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const routes = [
  { url: 'http://localhost:3000/', file: 'home.png' },
  { url: 'http://localhost:3000/hub', file: 'hub.png' },
  { url: 'http://localhost:3000/dashboard', file: 'dashboard.png' },
];

async function waitForServer(url, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(url, (r) => {
          res();
          req.destroy();
        });
        req.on('error', rej);
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  return false;
}

(async () => {
  const ok = await waitForServer('http://localhost:3000/');
  if (!ok) {
    console.error('Dev server not reachable at http://localhost:3000');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      console.log('Loading', route.url);
      await page.goto(route.url, { waitUntil: 'networkidle2', timeout: 60000 });
      // wait briefly for animations to settle
      await page.waitForTimeout(800);
      const filePath = path.join(outDir, route.file);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log('Saved', filePath);
      await page.close();
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
