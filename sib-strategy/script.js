/* ============================================================
   SIB 全体方針・3期成長戦略
   ページ制御 ＋ データ駆動の図表描画
   ・← → / Space / PageUp / PageDown / Home / End でページ移動
   ・M で目次、P で印刷（PDF）
   ・図表は data/*.js を読み込んで生成します
   ============================================================ */
(function () {
  "use strict";

  var M = window.SIB_METRICS || {};
  var T = window.SIB_TEAM || {};
  var P = window.SIB_PARTNERS || {};
  var MD = window.SIB_MEDIA || {};

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var waiting = '<span class="tagline wait">入力待ち</span>';

  /* ==========================================================
     1. 事業エコシステム
     ========================================================== */
  function ecosystem(el) {
    if (!el) return;
    var box = function (t, d, accent) {
      return '<div style="border-top:3px solid ' + accent + ';padding-top:20px">' +
        '<div class="step-t">' + t + "</div>" +
        (d ? '<div class="step-d">' + d + "</div>" : "") + "</div>";
    };
    var services = ["SNS運用支援", "学生プロジェクト", "学生リサーチ", "採用広報",
                    "AI活用支援", "LP / Web制作", "動画制作", "イベント支援"];
    el.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 56px 1fr 56px 1fr">' +
        '<div>' + box("学生コミュニティ", "AI・SNS・実践に意欲のある学生を集め、育てる", "#2563eb") + "</div>" +
        '<div class="to" style="align-self:center;color:#c0c8d6;font-size:22px;text-align:center">→</div>' +
        '<div>' + box("企業コミュニティ", "月額で継続的な接点をつくる", "#2563eb") + "</div>" +
        '<div class="to" style="align-self:center;color:#c0c8d6;font-size:22px;text-align:center">→</div>' +
        '<div>' + box("企業課題が見つかる", "続く関係だから、本音の相談が出る", "#f2701f") + "</div>" +
      "</div>" +

      '<div style="text-align:center;color:#c0c8d6;font-size:20px;padding:26px 0">↓</div>' +

      '<div style="border:1px solid var(--hair);border-radius:4px;padding:26px 32px;background:var(--offwhite)">' +
        '<div style="font-size:16px;font-weight:700;color:var(--muted);margin-bottom:16px">課題に応じて提供するサービス（別料金）</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px 32px">' +
          services.map(function (s) {
            return '<div style="font-size:19px;font-weight:600;color:var(--navy)">' + s + "</div>";
          }).join("") +
        "</div>" +
      "</div>" +

      '<div style="text-align:center;color:#c0c8d6;font-size:20px;padding:26px 0">↓</div>' +

      '<div style="display:grid;grid-template-columns:1fr 56px 1fr 56px 1fr">' +
        '<div>' + box("売上と実績", "継続収益＋案件収益がSIBに残る", "#8b7cf6") + "</div>" +
        '<div class="to" style="align-self:center;color:#c0c8d6;font-size:22px;text-align:center">→</div>' +
        '<div>' + box("学生の実践機会", "実案件が、そのまま学生の実績になる", "#8b7cf6") + "</div>" +
        '<div class="to" style="align-self:center;color:#c0c8d6;font-size:22px;text-align:center">→</div>' +
        '<div>' + box("学生コミュニティが強くなる", "さらに質の高い学生が集まる", "#2563eb") + "</div>" +
      "</div>" +

      '<div style="margin-top:30px;padding-top:22px;border-top:1px solid var(--hair);display:flex;align-items:center;gap:16px">' +
        '<span style="font-size:16px;font-weight:700;color:var(--blue)">↻ 循環</span>' +
        '<span style="font-size:19px;color:var(--muted);font-weight:500">1周するたびに、学生の質・企業との関係・運営ノウハウが増える。</span>' +
      "</div>";
  }

  /* ==========================================================
     2. 学生獲得ファネル
     ========================================================== */
  function funnel(el) {
    if (!el) return;
    var steps = [
      { t: "知ってもらう", d: "SNS・紹介・大学", c: "#dbe9ff" },
      { t: "参加する",     d: "イベント・公式LINE", c: "#bcd8ff" },
      { t: "選抜する",     d: "意欲・行動量で判断", c: "#7fb2ff" },
      { t: "育てる",       d: "学ぶ・作る", c: "#2563eb" },
      { t: "Project Ready", d: "企業PJに出せる状態", c: "#08152f" }
    ];
    var W = 760, H = 470, top = 720, bottom = 300, gap = 12;
    var h = (H - gap * (steps.length - 1)) / steps.length;
    var svg = ['<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="学生獲得ファネル">'];
    steps.forEach(function (s, i) {
      var y = i * (h + gap);
      var wTop = top - (top - bottom) * (i / steps.length);
      var wBot = top - (top - bottom) * ((i + 1) / steps.length);
      var x1 = (W - wTop) / 2, x2 = (W - wBot) / 2;
      svg.push('<polygon points="' + x1 + "," + y + " " + (x1 + wTop) + "," + y + " " +
        (x2 + wBot) + "," + (y + h) + " " + x2 + "," + (y + h) + '" fill="' + s.c + '"/>');
      var dark = i >= 3;
      svg.push('<text x="' + W / 2 + '" y="' + (y + h / 2 - 4) + '" text-anchor="middle" ' +
        'style="font-size:23px;font-weight:700;fill:' + (dark ? "#fff" : "#0e2246") + '">' + s.t + "</text>");
      svg.push('<text x="' + W / 2 + '" y="' + (y + h / 2 + 22) + '" text-anchor="middle" ' +
        'style="font-size:15px;font-weight:600;fill:' + (dark ? "rgba(255,255,255,.75)" : "#5b6883") + '">' + s.d + "</text>");
    });
    svg.push("</svg>");
    el.innerHTML = svg.join("");
  }

  /* ==========================================================
     3. 学生の実行部門
     ========================================================== */
  function departments(el) {
    if (!el || !T.departments) return;
    el.innerHTML = T.departments.map(function (d, i) {
      return '<div class="anim" style="padding:0 34px;' +
        (i === 0 ? "padding-left:0;" : "border-left:1px solid var(--hair);") + '">' +
        '<div style="font-size:16px;font-weight:700;color:var(--blue);margin-bottom:16px">0' + (i + 1) + "</div>" +
        '<div class="h3" style="font-size:26px;margin-bottom:14px">' + esc(d.name) + "</div>" +
        '<p class="tx sm">' + esc(d.summary) + "</p>" +
        "</div>";
    }).join("");
  }

  /* ==========================================================
     4. エリア拡大図
     ========================================================== */
  function areaMap(el) {
    if (!el) return;
    var W = 720, H = 660, cx = 360, cy = 340;
    var rings = [
      { r: 82,  label: "湘南",   sub: "PHASE 1", fill: "#08152f", op: 1 },
      { r: 155, label: "＋神奈川", sub: "PHASE 2", fill: "#2563eb", op: .20 },
      { r: 232, label: "＋東京",   sub: "PHASE 3", fill: "#2563eb", op: .13 },
      { r: 310, label: "＋首都圏", sub: "PHASE 4", fill: "#2563eb", op: .07 }
    ];
    var s = ['<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="エリア拡大の図">'];
    for (var i = rings.length - 1; i >= 0; i--) {
      var g = rings[i];
      s.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + g.r + '" fill="' + g.fill +
        '" fill-opacity="' + g.op + '"' + (i ? ' stroke="#2563eb" stroke-opacity=".22"' : "") + "/>");
    }
    rings.forEach(function (g, i) {
      if (i === 0) {
        s.push('<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" style="font-size:25px;font-weight:700;fill:#fff">' + g.label + "</text>");
        s.push('<text x="' + cx + '" y="' + (cy + 24) + '" text-anchor="middle" style="font-size:14px;font-weight:700;fill:rgba(255,255,255,.68)">' + g.sub + "</text>");
        return;
      }
      var y = cy - g.r + 32;
      s.push('<text x="' + cx + '" y="' + y + '" text-anchor="middle" style="font-size:22px;font-weight:700;fill:#0e2246">' + g.label + "</text>");
      s.push('<text x="' + cx + '" y="' + (y + 22) + '" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#8f9ab1">' + g.sub + "</text>");
    });
    s.push("</svg>");
    el.innerHTML = '<div style="max-width:580px;margin:0 auto">' + s.join("") +
      '<p class="note" style="text-align:center;margin:10px 0 0">円は、その時点で活動している累計エリアを表しています。</p></div>';
  }

  /* ==========================================================
     5. グラフ
     ========================================================== */
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  function lineChart(el, series, opt) {
    if (!el) return;
    opt = opt || {};
    var W = opt.w || 900, H = opt.h || 420;
    var padL = 20, padR = 30, padT = 40, padB = 46;
    var labels = (M.phases || []).map(function (p) { return p.label; });
    var vals = series.values || [];
    var has = vals.some(function (v) { return typeof v === "number"; });

    var s = ['<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="' + esc(series.label) + '">'];
    // ベースライン（横罫のみ・枠線なし）
    for (var g = 0; g <= 3; g++) {
      var y = padT + (H - padT - padB) * (g / 3);
      s.push('<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y +
        '" stroke="#eef0f5" stroke-width="1"/>');
    }
    // 目盛（期）
    labels.forEach(function (l, i) {
      var x = padL + (W - padL - padR) * (i / Math.max(labels.length - 1, 1));
      s.push('<text class="ax" x="' + x + '" y="' + (H - 14) + '" text-anchor="' +
        (i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle") + '">' + l + "</text>");
    });

    if (has) {
      var max = Math.max.apply(null, vals.filter(function (v) { return typeof v === "number"; })) || 1;
      var pts = vals.map(function (v, i) {
        if (typeof v !== "number") return null;
        var x = padL + (W - padL - padR) * (i / Math.max(vals.length - 1, 1));
        var y = padT + (H - padT - padB) * (1 - v / (max * 1.15));
        return [x, y, v];
      }).filter(Boolean);
      var d = pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ");
      s.push('<path d="' + d + ' L ' + pts[pts.length - 1][0] + " " + (H - padB) + " L " + pts[0][0] + " " + (H - padB) +
        ' Z" fill="#2563eb" fill-opacity=".07"/>');
      s.push('<path d="' + d + '" fill="none" stroke="#2563eb" stroke-width="2.5"/>');
      pts.forEach(function (p, i) {
        s.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#2563eb"/>');
        s.push('<text class="vl" x="' + p[0] + '" y="' + (p[1] - 18) + '" text-anchor="' +
          (i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle") + '">' + fmt(p[2]) + (series.unit || "") + "</text>");
      });
    }
    s.push("</svg>");

    el.innerHTML = '<div style="position:relative">' + s.join("") + (has ? "" :
      '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
      'justify-content:center;gap:14px">' + waiting +
      '<div style="font-size:18px;color:var(--faint);font-weight:600">' + esc(series.note || "") + "</div>" +
      "</div>") + "</div>";
  }

  function miniCharts(el) {
    if (!el) return;
    var list = (M.series || []).filter(function (s) { return s.key !== "revenue"; });
    el.innerHTML = list.map(function (s) {
      var has = (s.values || []).some(function (v) { return typeof v === "number"; });
      return '<div style="padding:20px 0;border-bottom:1px solid var(--hair);display:flex;align-items:center;justify-content:space-between;gap:20px">' +
        '<div><div style="font-size:20px;font-weight:700;color:var(--navy)">' + esc(s.label) + "</div>" +
        '<div style="font-size:15px;color:var(--faint);font-weight:500;margin-top:5px">' + esc(s.note || "") + "</div></div>" +
        (has
          ? '<div style="font-size:26px;font-weight:700;color:var(--navy);white-space:nowrap">' +
            s.values.filter(function (v) { return typeof v === "number"; }).map(function (v) { return fmt(v); }).join(" → ") + "</div>"
          : waiting) +
        "</div>";
    }).join("");
  }

  /* ==========================================================
     6. KPI 表
     ========================================================== */
  function kpiTable(el) {
    if (!el || !M.kpi) return;
    el.innerHTML =
      "<thead><tr><th style=\"width:34%\">指標</th><th style=\"width:33%\">実績</th><th style=\"width:33%\">目標</th></tr></thead><tbody>" +
      M.kpi.map(function (k) {
        return "<tr><td class=\"k\">" + esc(k.label) + "</td>" +
          "<td>" + (k.actual ? '<span class="tagline fact">' + esc(k.actual) + "</span>" : waiting) + "</td>" +
          "<td>" + (k.target ? '<span class="tagline plan">' + esc(k.target) + "</span>" : waiting) + "</td></tr>";
      }).join("") + "</tbody>";
  }

  /* ==========================================================
     7. 体制
     ========================================================== */
  function teamTable(el) {
    if (!el || !T.roles) return;
    el.innerHTML =
      '<thead><tr><th style="width:24%">責任領域</th><th style="width:20%">ミッション</th>' +
      '<th style="width:30%">担当範囲</th><th style="width:26%">証明すること</th></tr></thead><tbody>' +
      T.roles.map(function (r) {
        var who = r.name
          ? '<div style="font-size:16px;color:var(--muted);font-weight:600;margin-top:8px">' + esc(r.name) + "</div>"
          : '<div style="margin-top:6px">' + waiting + "</div>";
        return "<tr><td class=\"k\">" + esc(r.position) + who + "</td>" +
          "<td class=\"k\" style=\"font-size:19px\">" + esc(r.mission) + "</td>" +
          "<td>" + esc(r.responsibility) + "</td>" +
          "<td>" + esc(r.proof) + "</td></tr>";
      }).join("") + "</tbody>";
  }

  /* ==========================================================
     8. 年間カレンダー
     ========================================================== */
  function calendar(el) {
    if (!el) return;
    var months = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2", "3"];
    var rows = [
      {
        label: "学生獲得・育成", cls: "stu", items: {
          0: ["新歓・学生募集", "予定"], 1: ["選抜・オンボード", "構想"],
          4: ["AI×SNS プログラム", "構想"], 9: ["新年度に向けた募集", "構想"]
        }
      },
      {
        label: "企業獲得", cls: "biz", items: {
          0: ["企業ヒアリング", "実行中"], 2: ["初期会員の獲得", "実行中"],
          6: ["企業PJ の提案", "構想"], 10: ["次年度の契約更新", "構想"]
        }
      },
      {
        label: "学生×企業の接点", cls: "com", items: {
          2: ["湘南交流会（U-PORT）", "予定 6/7"], 4: ["サマー企画・合宿", "構想"],
          6: ["企業PJ 始動", "構想"], 8: ["Project Demo", "構想"], 11: ["経営者交流会", "構想"]
        }
      },
      {
        label: "認知・広報", cls: "brd", items: {
          1: ["公式LINE / SNS 強化", "予定"], 5: ["ピッチコンテスト", "構想"],
          8: ["SIB Award", "構想"], 11: ["年間の事例発信", "構想"]
        }
      }
    ];
    var h = ['<div class="hd"></div>'];
    months.forEach(function (m) { h.push('<div class="hd">' + m + "月</div>"); });
    rows.forEach(function (r) {
      h.push('<div class="rowlab">' + r.label + "</div>");
      for (var i = 0; i < 12; i++) {
        var it = r.items[i];
        h.push('<div class="cell">' + (it
          ? '<div class="ev ' + r.cls + '">' + it[0] + '<span class="st">' + it[1] + "</span></div>"
          : "") + "</div>");
      }
    });
    el.innerHTML = h.join("");
  }

  /* ==========================================================
     9. 実績の数字
     ========================================================== */
  function actuals(el) {
    if (!el || !M.actuals) return;
    el.innerHTML = M.actuals.map(function (a, i) {
      return '<div class="fig"' + (i === 0 ? ' style="padding-left:0"' : "") + ">" +
        '<div class="n" data-count="' + a.value + '">' + a.value + "<em>" + a.unit + (a.suffix || "") + "</em></div>" +
        '<div class="l">' + esc(a.label) + "</div></div>";
    }).join("");
  }

  /* ==========================================================
     10. パートナー
     ========================================================== */
  function partners(el) {
    if (!el || !P.confirmed) return;
    var groups = [
      { kind: "co-host", label: "共催", note: "一緒にイベントを作った相手" },
      { kind: "guest",   label: "ゲスト登壇", note: "イベントに登壇いただいた方" },
      { kind: "public",  label: "行政・地域", note: "自治体との活動" },
      { kind: "venue",   label: "会場・拠点", note: "開催にご協力いただいた場所" }
    ];
    var cols = groups.map(function (g, i) {
      var items = P.confirmed.filter(function (c) { return c.kind === g.kind; });
      return '<div class="anim" style="padding:0 30px;' +
          (i === 0 ? "padding-left:0;" : "border-left:1px solid var(--hair);") + '">' +
        '<div style="font-size:17px;font-weight:700;color:var(--blue);margin-bottom:6px">' + g.label + "</div>" +
        '<div style="font-size:15px;color:var(--faint);font-weight:500;margin-bottom:22px">' + g.note + "</div>" +
        '<div class="rows">' + items.map(function (c) {
          return '<div class="row" style="grid-template-columns:1fr;padding:18px 0">' +
            '<div class="k" style="font-size:21px">' + esc(c.name) + "</div>" +
            '<div class="v" style="font-size:16px;margin-top:6px">' + esc(c.detail) + "</div></div>";
        }).join("") + "</div></div>";
    }).join("");

    el.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:44px">' + cols + "</div>" +
      '<div style="padding-top:28px;border-top:1px solid var(--hair);display:flex;gap:60px;align-items:flex-start">' +
        '<div style="flex:1"><div style="font-size:17px;font-weight:700;color:var(--navy);margin-bottom:8px">正式提携</div>' +
          (P.formalPartners && P.formalPartners.length
            ? '<p class="tx sm">' + P.formalPartners.map(function (f) { return esc(f.name); }).join("／") + "</p>"
            : '<div style="display:flex;gap:12px;align-items:center">' + waiting +
              '<span class="tx sm">契約ベースの提携が確認できたものだけを掲載します。</span></div>') +
        "</div>" +
        '<div style="flex:1"><div style="font-size:17px;font-weight:700;color:var(--navy);margin-bottom:8px">スポンサー企業</div>' +
          '<p class="tx sm">' + esc(P.sponsorsNote || "") + "</p></div>" +
      "</div>";
  }

  /* ==========================================================
     11. メディア
     ========================================================== */
  function media(el) {
    if (!el) return;
    if (MD.items && MD.items.length) {
      el.innerHTML = '<div class="rows">' + MD.items.map(function (m) {
        return '<div class="row" style="grid-template-columns:150px 190px 1fr">' +
          '<div class="n">' + esc(m.date) + "</div>" +
          '<div class="v" style="font-weight:700;color:var(--navy)">' + esc(m.outlet) + "</div>" +
          '<div class="v">' + esc(m.title) + '<span style="color:var(--faint);margin-left:12px">' + esc(m.type) + "</span></div>" +
          "</div>";
      }).join("") + "</div>";
      return;
    }
    var types = ["新聞", "Webメディア", "地域メディア", "オウンドメディア", "イベント登壇", "YouTube", "Podcast", "SNS掲載"];
    el.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center">' +
        '<div class="anim">' +
          '<div style="margin-bottom:24px">' + waiting + "</div>" +
          '<div class="h3" style="font-size:32px;margin-bottom:20px">掲載・出演の記録は、現在整理中です。</div>' +
          '<p class="tx">確認できたものから <span style="color:var(--navy);font-weight:700">data/media.js</span> に追加すると、このページに時系列で表示されます。事実確認が取れていない掲載は載せません。</p>' +
        "</div>" +
        '<div class="anim"><div style="font-size:16px;font-weight:700;color:var(--muted);margin-bottom:20px">記録する対象</div>' +
        '<div class="rows">' + types.map(function (t) {
          return '<div class="row" style="grid-template-columns:1fr;padding:15px 0"><div class="v" style="font-size:19px;color:var(--navy);font-weight:600">' + t + "</div></div>";
        }).join("") + "</div></div>" +
      "</div>";
  }

  /* ==========================================================
     ページ制御
     ========================================================== */
  var stage = $("stage");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var current = 0;

  slides.forEach(function (el, i) {
    var pageNo = String(i + 1).padStart(2, "0");
    if (el.getAttribute("data-chrome") === "off") return;

    var head = document.createElement("div");
    head.className = "s-head";
    head.innerHTML =
      '<span class="ch">' + (el.getAttribute("data-ch") || "") + "</span>" +
      '<span class="sec">' + esc(el.getAttribute("data-sec") || "") + "</span>" +
      '<span class="sp"></span>' +
      '<span class="brand">SIB 全体方針・3期成長戦略</span>';
    el.insertBefore(head, el.firstChild);

    var foot = document.createElement("div");
    foot.className = "s-foot";
    foot.innerHTML = "<span>Shonan Innovation Base ／ Internal Strategy Deck 2026</span>" +
      '<span class="pg">' + pageNo + " / " + String(total).padStart(2, "0") + "</span>";
    el.appendChild(foot);
  });

  function resize() {
    stage.style.transform = "scale(" + Math.min(window.innerWidth / 1920, window.innerHeight / 1080) + ")";
  }

  var uiPos = $("uiPos"), uiProgress = $("uiProgress"), uiHint = $("uiHint");

  function show(i, push) {
    current = Math.max(0, Math.min(total - 1, i));
    slides.forEach(function (el, n) { el.classList.toggle("is-active", n === current); });
    uiPos.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    uiProgress.style.width = ((current + 1) / total) * 100 + "%";
    if (push !== false) history.replaceState(null, "", "#" + (current + 1));
  }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  var uiIndex = $("uiIndex"), uiIndexList = $("uiIndexList");
  slides.forEach(function (el, i) {
    var t = el.querySelector("h2.t") || el.querySelector(".chapter h2") || el.querySelector("h2") || el.querySelector("h1");
    var label = t ? t.textContent.replace(/\s+/g, " ").trim() : "";
    if (label.length > 30) label = label.slice(0, 30) + "…";
    var row = document.createElement("div");
    row.className = "row";
    row.innerHTML = "<b>" + String(i + 1).padStart(2, "0") + "</b><span>" + esc(label) + "</span>";
    row.addEventListener("click", function () { closeIndex(); show(i); });
    uiIndexList.appendChild(row);
  });
  function toggleIndex() { uiIndex.classList.toggle("open"); }
  function closeIndex() { uiIndex.classList.remove("open"); }

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

  $("btnNext").addEventListener("click", next);
  $("btnPrev").addEventListener("click", prev);
  $("btnIndex").addEventListener("click", toggleIndex);
  uiIndex.addEventListener("click", function (e) { if (e.target === uiIndex) closeIndex(); });

  document.querySelector(".deck").addEventListener("click", function (e) {
    if (uiIndex.classList.contains("open")) return;
    if (e.clientX < window.innerWidth * 0.25) prev(); else next();
    hideHint();
  });

  var touchX = null;
  document.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });

  var hintTimer = setTimeout(hideHint, 6000);
  function hideHint() { clearTimeout(hintTimer); uiHint.classList.add("hide"); }

  /* ---------- 描画 ---------- */
  ecosystem($("ecoDiagram"));
  funnel($("funnel"));
  departments($("departments"));
  areaMap($("areaMap"));
  var rev = (M.series || []).filter(function (s) { return s.key === "revenue"; })[0];
  if (rev) lineChart($("chartRevenue"), rev, { w: 900, h: 420 });
  miniCharts($("chartMini"));
  kpiTable($("kpiTable"));
  teamTable($("teamTable"));
  calendar($("calendar"));
  actuals($("actuals"));
  partners($("partners"));
  media($("media"));

  window.addEventListener("resize", resize);
  resize();

  var fromHash = parseInt((location.hash || "").replace("#", ""), 10);
  show(isNaN(fromHash) ? 0 : fromHash - 1, false);
})();
