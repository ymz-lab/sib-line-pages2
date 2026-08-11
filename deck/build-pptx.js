const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// ---- speaker notes from the markdown ----
const md = fs.readFileSync('/home/user/sib-line-pages2/deck/speaker-notes.md', 'utf8');
const notes = {};
const parts = md.split(/^## (\d{2}) \/ (.+)$/m);
for (let i = 1; i < parts.length; i += 3) {
  const num = parts[i];
  const title = parts[i + 1].replace(/\s*★重要\s*$/, '').trim();
  let body = parts[i + 2].split(/^---$/m)[0];
  body = body
    .replace(/\*\*/g, '')
    .replace(/^\s*>\s?/gm, '')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  notes[num] = `【${num} / ${title}】\n\n${body}`;
}

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';          // 13.333 x 7.5 in  (16:9)
pres.author = '学生団体SIB';
pres.company = '学生団体SIB / Shonan Innovation Base';
pres.title = '学生団体SIB ご紹介資料';
pres.subject = '学生・企業・地域をつなぎ、挑戦のきっかけを創る湘南発コミュニティ';

const ids = Array.from({ length: 18 }, (_, i) => String(i + 1).padStart(2, '0'));

for (const id of ids) {
  const slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };
  const buf = fs.readFileSync(path.join(__dirname, 'png2x', `s${id}.jpg`));
  slide.addImage({
    data: 'image/jpeg;base64,' + buf.toString('base64'),
    x: 0, y: 0, w: '100%', h: '100%',
  });
  if (notes[id]) slide.addNotes(notes[id]);
}

pres.writeFile({ fileName: '/home/user/sib-line-pages2/deck/sib-deck.pptx' })
  .then((f) => console.log('written', f, fs.statSync(f).size, 'bytes'));
