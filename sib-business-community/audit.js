/* 完成画面ベースの自動検査
   1) 24px未満の文字   2) 枠外はみ出し
   3) 日本語の不自然な改行（最終行が1文字だけ／行頭に句読点・閉じ括弧）
   4) 英単語の途中改行  5) 異常Unicode                                    */
const puppeteer = require('puppeteer-core'), path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080 });
  await p.goto('file://' + path.join(process.cwd(), 'index.html') + '?static=1', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);

  const r = await p.evaluate(() => {
    const small = [], out = [], orphan = [], enSplit = [], headTaboo = [], uni = [];
    const TABOO_HEAD = '。、）」』】！？・：；ー'.split('');
    const BAD_UNI = /[가-힯�​-‏‪-‮⁠-⁤﻿]/;

    function linesOf(node) {                       // テキストノードを行ごとに分解
      const t = node.textContent; const rg = document.createRange();
      const lines = []; let cur = null;
      for (let i = 0; i < t.length; i++) {
        rg.setStart(node, i); rg.setEnd(node, i + 1);
        const rect = rg.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) { if (cur) cur.text += t[i]; continue; }
        const top = Math.round(rect.top);
        if (!cur || Math.abs(cur.top - top) > 3) { cur = { top, text: t[i] }; lines.push(cur); }
        else cur.text += t[i];
      }
      return lines.map(l => l.text);
    }

    document.querySelectorAll('.slide').forEach(sl => {
      const sb = sl.getBoundingClientRect(), cs = getComputedStyle(sl);
      const top = sb.top + Math.min(parseFloat(cs.paddingTop) || 0, 40);
      const bot = sb.bottom - Math.min(parseFloat(cs.paddingBottom) || 0, 40);

      sl.querySelectorAll('*').forEach(el => {
        const tns = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
        if (!tns.length) return;
        const txt = tns.map(n => n.textContent.trim()).join('');
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 24) small.push(`${sl.id} ${fs}px ${txt.slice(0, 26)}`);
        if (BAD_UNI.test(txt)) uni.push(`${sl.id} ${txt.slice(0, 40)}`);
        const rc = el.getBoundingClientRect();
        if (rc.height && (rc.bottom > bot + 1 || rc.top < top - 1))
          out.push(`${sl.id} | ${txt.slice(0, 24)}`);

        tns.forEach(n => {
          const ls = linesOf(n).map(s => s.replace(/\s+$/, '')).filter(s => s.length);
          if (ls.length < 2) return;
          const last = ls[ls.length - 1];
          if ([...last].length === 1) orphan.push(`${sl.id} | 最終行が1文字「${last}」| ${txt.slice(0, 30)}`);
          for (let i = 0; i < ls.length - 1; i++) {
            const a = ls[i], c = ls[i + 1];
            if (/[A-Za-z0-9]$/.test(a) && /^[A-Za-z0-9]/.test(c))
              enSplit.push(`${sl.id} | 「${a.slice(-10)}」/「${c.slice(0, 10)}」`);
            if (TABOO_HEAD.includes(c[0]))
              headTaboo.push(`${sl.id} | 行頭「${c[0]}」| ${c.slice(0, 14)}`);
          }
        });
      });
    });
    return { small, out: [...new Set(out)], orphan: [...new Set(orphan)],
             enSplit: [...new Set(enSplit)], headTaboo: [...new Set(headTaboo)], uni,
             autoPhrase: CSS.supports('word-break', 'auto-phrase') };
  });

  const show = (label, arr) => { console.log(`◆ ${label}: ${arr.length}`); arr.slice(0, 25).forEach(x => console.log('   ', x)); };
  console.log('word-break:auto-phrase 対応 =', r.autoPhrase);
  show('24px未満', r.small);
  show('枠外はみ出し', r.out);
  show('異常Unicode', r.uni);
  show('最終行が1文字', r.orphan);
  show('英単語の途中改行', r.enSplit);
  show('禁則違反(行頭)', r.headTaboo);
  await b.close();
})();
