/**
 * SIB Business Community 提案資料 — PDF / PNG 書き出しスクリプト
 *
 *   node scripts/export.js            … PDF + PNG を全て書き出す
 *   node scripts/export.js --png      … PNG のみ
 *   node scripts/export.js --pdf      … PDF のみ
 *   node scripts/export.js --only 6   … 指定スライドの PNG のみ（確認用）
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'output');
const INDEX = 'file://' + path.join(ROOT, 'index.html') + '?static=1';
const PDF_NAME = 'SIB_Business_Community_提案資料.pdf';

const W = 1920;
const H = 1080;

const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (fs.existsSync(p)) return p;
  throw new Error('Chromium が見つかりません: ' + CHROME_CANDIDATES.join(', '));
}

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const onlyIdx = argv.indexOf('--only');
const only = onlyIdx > -1 ? Number(argv[onlyIdx + 1]) : null;
const doPng = has('--png') || only !== null || (!has('--pdf'));
const doPdf = (has('--pdf') || (!has('--png') && only === null));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(INDEX, { waitUntil: 'networkidle0', timeout: 120000 });

  // Web フォントの読み込み完了を待つ
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 800));

  const count = await page.$$eval('.slide', (els) => els.length);
  console.log(`スライド数: ${count}`);
  if (count !== 18) console.warn(`⚠ スライド数が18ではありません (${count})`);

  // ---------- PNG ----------
  if (doPng) {
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      const n = i + 1;
      if (only !== null && n !== only) continue;
      const file = path.join(OUT, `slide-${String(n).padStart(2, '0')}.png`);
      await slides[i].screenshot({ path: file });
      console.log('PNG  ✓', path.basename(file));
    }
  }

  // ---------- PDF ----------
  if (doPdf) {
    const file = path.join(OUT, PDF_NAME);
    await page.pdf({
      path: file,
      width: `${W}px`,
      height: `${H}px`,
      printBackground: true,
      pageRanges: `1-${count}`,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      preferCSSPageSize: false,
    });
    console.log('PDF  ✓', PDF_NAME);
  }

  await browser.close();
  console.log('完了 →', OUT);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
