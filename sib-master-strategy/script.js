/* ============================================================
   SIBのこれから｜全体方針・事業戦略 — ページ制御
   ・← → / Space / PageUp / PageDown / Home / End でページ移動
   ・M で目次、P で印刷（PDF）
   ・1920x1080 のステージをビューポートに合わせて等比スケール
   ============================================================ */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var current = 0;

  /* ---------- 1. スライドの共通パーツ（ヘッダー / フッター）を自動生成 ---------- */
  slides.forEach(function (el, i) {
    var pageNo = String(i + 1).padStart(2, "0");
    el.setAttribute("data-page", pageNo);

    if (el.getAttribute("data-chrome") === "off") return;

    var head = document.createElement("div");
    head.className = "s-head";
    head.innerHTML =
      '<span class="s-num">' + pageNo + "</span>" +
      '<span class="s-sec">' + (el.getAttribute("data-sec") || "") + "</span>" +
      '<span class="rule"></span>' +
      '<span class="s-brand">SIBのこれから</span>';
    el.insertBefore(head, el.firstChild);

    var foot = document.createElement("div");
    foot.className = "s-foot";
    foot.innerHTML =
      "<span>Shonan Innovation Base ／ メンバー向け内部資料</span>" +
      '<span class="pg">' + pageNo + " / " + String(total).padStart(2, "0") + "</span>";
    el.appendChild(foot);
  });

  /* ---------- 2. スケーリング ---------- */
  function resize() {
    var scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "scale(" + scale + ")";
  }

  /* ---------- 3. ページ移動 ---------- */
  var uiPos = document.getElementById("uiPos");
  var uiProgress = document.getElementById("uiProgress");
  var uiHint = document.getElementById("uiHint");

  function show(i, push) {
    current = Math.max(0, Math.min(total - 1, i));
    slides.forEach(function (el, n) {
      el.classList.toggle("is-active", n === current);
    });
    uiPos.textContent =
      String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    uiProgress.style.width = ((current + 1) / total) * 100 + "%";
    if (push !== false) {
      history.replaceState(null, "", "#" + (current + 1));
    }
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  /* ---------- 4. 目次 ---------- */
  var uiIndex = document.getElementById("uiIndex");
  var uiIndexList = document.getElementById("uiIndexList");

  slides.forEach(function (el, i) {
    var titleEl = el.querySelector(".s-title") || el.querySelector("h1") || el.querySelector("h2");
    var label = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
    if (label.length > 34) label = label.slice(0, 34) + "…";
    var row = document.createElement("div");
    row.className = "row";
    row.innerHTML = "<b>" + String(i + 1).padStart(2, "0") + "</b><span>" + label + "</span>";
    row.addEventListener("click", function () {
      closeIndex();
      show(i);
    });
    uiIndexList.appendChild(row);
  });

  function toggleIndex() { uiIndex.classList.toggle("open"); }
  function closeIndex() { uiIndex.classList.remove("open"); }

  /* ---------- 5. 入力 ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case " ": case "PageDown":
        e.preventDefault(); closeIndex(); next(); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp":
        e.preventDefault(); closeIndex(); prev(); break;
      case "Home": e.preventDefault(); show(0); break;
      case "End": e.preventDefault(); show(total - 1); break;
      case "m": case "M": toggleIndex(); break;
      case "p": case "P": e.preventDefault(); window.print(); break;
      case "Escape": closeIndex(); break;
      default: return;
    }
    hideHint();
  });

  document.getElementById("btnNext").addEventListener("click", next);
  document.getElementById("btnPrev").addEventListener("click", prev);
  document.getElementById("btnIndex").addEventListener("click", toggleIndex);
  uiIndex.addEventListener("click", function (e) {
    if (e.target === uiIndex) closeIndex();
  });

  /* クリック / タップでの移動（UI・目次の上では無効） */
  document.querySelector(".deck").addEventListener("click", function (e) {
    if (uiIndex.classList.contains("open")) return;
    if (e.clientX < window.innerWidth * 0.25) prev();
    else next();
    hideHint();
  });

  /* スワイプ */
  var touchX = null;
  document.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });

  var hintTimer = setTimeout(hideHint, 6000);
  function hideHint() {
    clearTimeout(hintTimer);
    uiHint.classList.add("hide");
  }

  /* ---------- 6. 初期化 ---------- */
  window.addEventListener("resize", resize);
  resize();

  var fromHash = parseInt((location.hash || "").replace("#", ""), 10);
  show(isNaN(fromHash) ? 0 : fromHash - 1, false);
})();
