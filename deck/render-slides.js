const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const outDir = path.join(__dirname, 'png2x');
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file:///home/user/sib-line-pages2/deck/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    const d = document.getElementById('deck');
    d.style.transform = 'none'; d.style.height = 'auto';
    document.getElementById('deckNav').style.display = 'none';
    document.querySelectorAll('.slide').forEach(s => { s.style.boxShadow = 'none'; s.style.borderRadius = '0'; });
  });
  await p.waitForTimeout(600);
  const slides = await p.$$('.slide');
  for (const s of slides) {
    const id = await s.getAttribute('id');
    await s.screenshot({ path: path.join(outDir, `${id}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
  console.log('rendered', slides.length, 'at 2x');
})();
