/* SIB Business Community — 表示用スクリプト
   ・← / → / Space / PageUp / PageDown でページ移動
   ・スクロール連動の控えめなアニメーション
   ・?static=1（PDF書き出し時）ではアニメーションを無効化し、完成状態で描画する */
(function () {
  'use strict';
  var STATIC = /[?&]static=1/.test(location.search);
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  /* ---------- アニメーション ---------- */
  if (!STATIC && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-in'); });
    }, { threshold: 0.25 });
    slides.forEach(function (s) { io.observe(s); });
  } else {
    slides.forEach(function (s) { s.classList.add('is-in'); });
  }

  /* ---------- キーボードでのページ移動 ---------- */
  function current() {
    var best = 0, min = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.getBoundingClientRect().top);
      if (d < min) { min = d; best = i; }
    });
    return best;
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar') {
      e.preventDefault(); go(current() + 1);
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault(); go(current() - 1);
    } else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End')  { e.preventDefault(); go(slides.length - 1); }
  });
})();
