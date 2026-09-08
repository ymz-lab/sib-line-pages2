(function () {
  "use strict";

  const STORAGE_KEY = "sib_sns_posts_v1";

  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  let posts = loadPosts();

  function platformInfo(id) {
    return PLATFORMS.find((p) => p.id === id) || { label: id, color: "#888" };
  }
  function statusInfo(id) {
    return STATUSES.find((s) => s.id === id) || { label: id };
  }

  // ---------- タブ切り替え ----------
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".panel").forEach((p) => p.classList.add("hidden"));
      document.getElementById("panel-" + btn.dataset.tab).classList.remove("hidden");
    });
  });

  // ---------- セレクトの初期化 ----------
  function fillSelect(select, items, valueKey, labelKey, withAllOption) {
    items.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item[valueKey];
      opt.textContent = item[labelKey];
      select.appendChild(opt);
    });
  }
  fillSelect(document.getElementById("f-platform"), PLATFORMS, "id", "label");
  fillSelect(document.getElementById("f-status"), STATUSES, "id", "label");
  fillSelect(document.getElementById("filterPlatform"), PLATFORMS, "id", "label");
  fillSelect(document.getElementById("filterStatus"), STATUSES, "id", "label");

  // ---------- 投稿フォーム ----------
  const form = document.getElementById("postForm");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEdit");

  function resetForm() {
    form.reset();
    document.getElementById("postId").value = "";
    submitBtn.textContent = "投稿を追加";
    cancelEditBtn.classList.add("hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("postId").value || String(Date.now());
    const scheduledDate = document.getElementById("f-date").value;
    const scheduledTime = document.getElementById("f-time").value;
    const post = {
      id,
      platform: document.getElementById("f-platform").value,
      status: document.getElementById("f-status").value,
      title: document.getElementById("f-title").value.trim(),
      caption: document.getElementById("f-caption").value.trim(),
      hashtags: document.getElementById("f-hashtags").value.trim(),
      imageNote: document.getElementById("f-image").value.trim(),
      scheduledDate,
      scheduledTime,
      createdAt: (posts.find((p) => p.id === id) || {}).createdAt || new Date().toISOString(),
    };
    const existingIndex = posts.findIndex((p) => p.id === id);
    if (existingIndex >= 0) posts[existingIndex] = post;
    else posts.push(post);
    savePosts(posts);
    resetForm();
    renderList();
  });

  cancelEditBtn.addEventListener("click", resetForm);

  function editPost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    document.getElementById("postId").value = post.id;
    document.getElementById("f-platform").value = post.platform;
    document.getElementById("f-status").value = post.status;
    document.getElementById("f-title").value = post.title;
    document.getElementById("f-caption").value = post.caption;
    document.getElementById("f-hashtags").value = post.hashtags;
    document.getElementById("f-image").value = post.imageNote;
    document.getElementById("f-date").value = post.scheduledDate || "";
    document.getElementById("f-time").value = post.scheduledTime || "";
    submitBtn.textContent = "変更を保存";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deletePost(id) {
    if (!confirm("この投稿を削除しますか？")) return;
    posts = posts.filter((p) => p.id !== id);
    savePosts(posts);
    renderList();
  }

  function duplicatePost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const copy = Object.assign({}, post, {
      id: String(Date.now()),
      title: post.title + "（コピー）",
      status: "idea",
      createdAt: new Date().toISOString(),
    });
    posts.push(copy);
    savePosts(posts);
    renderList();
  }

  function copyCaption(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const text = [post.caption, post.hashtags].filter(Boolean).join("\n\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert("キャプションをコピーしました"));
    }
  }

  // ---------- 一覧描画 ----------
  const postListEl = document.getElementById("postList");
  const emptyNote = document.getElementById("emptyNote");
  const filterPlatform = document.getElementById("filterPlatform");
  const filterStatus = document.getElementById("filterStatus");
  filterPlatform.addEventListener("change", renderList);
  filterStatus.addEventListener("change", renderList);

  function renderList() {
    let list = posts.slice();
    if (filterPlatform.value) list = list.filter((p) => p.platform === filterPlatform.value);
    if (filterStatus.value) list = list.filter((p) => p.status === filterStatus.value);

    list.sort((a, b) => {
      const da = a.scheduledDate || "9999";
      const db = b.scheduledDate || "9999";
      if (da !== db) return da < db ? -1 : 1;
      const ta = a.scheduledTime || "99:99";
      const tb = b.scheduledTime || "99:99";
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });

    postListEl.innerHTML = "";
    emptyNote.classList.toggle("hidden", list.length > 0);

    list.forEach((post) => {
      const pf = platformInfo(post.platform);
      const st = statusInfo(post.status);
      const el = document.createElement("div");
      el.className = "postCard";
      const when =
        post.scheduledDate || post.scheduledTime
          ? `${post.scheduledDate || "日付未定"} ${post.scheduledTime || ""}`.trim()
          : "日時未設定";
      el.innerHTML = `
        <div class="rowTop">
          <div>
            <span class="badge" style="background:${pf.color}">${pf.label}</span>
            <span class="statusBadge">${st.label}</span>
            <h3>${escapeHtml(post.title)}</h3>
          </div>
        </div>
        <div class="postMeta">投稿予定：${escapeHtml(when)}</div>
        ${post.caption ? `<div class="postCaption">${escapeHtml(post.caption)}</div>` : ""}
        ${post.hashtags ? `<div class="postTags">${escapeHtml(post.hashtags)}</div>` : ""}
        ${post.imageNote ? `<div class="postImgNote">画像/動画メモ：${escapeHtml(post.imageNote)}</div>` : ""}
        <div class="cardActions">
          <button class="miniBtn" data-act="edit">編集</button>
          <button class="miniBtn" data-act="dup">複製</button>
          <button class="miniBtn" data-act="copy">キャプションをコピー</button>
          <button class="miniBtn danger" data-act="del">削除</button>
        </div>
      `;
      el.querySelector('[data-act="edit"]').addEventListener("click", () => editPost(post.id));
      el.querySelector('[data-act="dup"]').addEventListener("click", () => duplicatePost(post.id));
      el.querySelector('[data-act="copy"]').addEventListener("click", () => copyCaption(post.id));
      el.querySelector('[data-act="del"]').addEventListener("click", () => deletePost(post.id));
      postListEl.appendChild(el);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  // ---------- バズ投稿リファレンス ----------
  const referenceList = document.getElementById("referenceList");
  REFERENCE_POSTS.forEach((ref) => {
    const pf = platformInfo(ref.platform);
    const el = document.createElement("div");
    el.className = "refCard";
    el.innerHTML = `
      <div class="cat">${escapeHtml(ref.category)}｜<span class="badge" style="background:${pf.color}">${pf.label}</span></div>
      <h3>${escapeHtml(ref.title)}</h3>
      <div class="why"><b>伸びやすい理由：</b>${escapeHtml(ref.why)}</div>
      <div class="structure"><b>構成の型：</b>${escapeHtml(ref.structure)}</div>
      <div class="tplBox">${escapeHtml(ref.captionTemplate)}</div>
      <div class="tags">${escapeHtml(ref.hashtags)}</div>
    `;
    referenceList.appendChild(el);
  });

  // ---------- 投稿タイミングガイド ----------
  const timingList = document.getElementById("timingList");
  TIMING_GUIDE.forEach((guide) => {
    const pf = platformInfo(guide.platform);
    const el = document.createElement("div");
    el.className = "timingCard";
    const rows = guide.bestTimes
      .map(
        (t) =>
          `<div class="timeRow"><span class="day">${escapeHtml(t.day)}</span><span class="time">${escapeHtml(t.time)}</span><span class="reason">${escapeHtml(t.reason)}</span></div>`
      )
      .join("");
    el.innerHTML = `
      <h3><span class="badge" style="background:${pf.color}">${pf.label}</span></h3>
      ${rows}
      <div class="notes">${escapeHtml(guide.notes)}</div>
    `;
    timingList.appendChild(el);
  });

  // ---------- フィード画像ジェネレーター ----------
  const tplSelect = document.getElementById("tplSelect");
  fillSelect(tplSelect, IMAGE_TEMPLATES, "id", "name");
  const headlineInput = document.getElementById("tplHeadline");
  const subInput = document.getElementById("tplSub");
  const labelInput = document.getElementById("tplLabel");
  const canvas = document.getElementById("feedCanvas");
  const ctx = canvas.getContext("2d");

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split("");
    let line = "";
    const lines = [];
    words.forEach((ch) => {
      const testLine = line + ch;
      if (context.measureText(testLine).width > maxWidth && line !== "") {
        lines.push(line);
        line = ch;
      } else {
        line = testLine;
      }
    });
    if (line) lines.push(line);
    lines.forEach((l, i) => context.fillText(l, x, y + i * lineHeight));
    return lines.length;
  }

  function drawFeedImage() {
    const tpl = IMAGE_TEMPLATES.find((t) => t.id === tplSelect.value) || IMAGE_TEMPLATES[0];
    const headline = headlineInput.value || "見出しテキストを入力";
    const sub = subInput.value || "サブテキストを入力";
    const label = labelInput.value || "SIB";
    const W = canvas.width;
    const H = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, tpl.bg[0]);
    grad.addColorStop(1, tpl.bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 左上ラベル
    ctx.fillStyle = tpl.accent;
    ctx.font = "bold 34px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(label, 70, 70);

    // アクセントの帯
    ctx.fillRect(70, 130, 90, 8);

    ctx.fillStyle = tpl.textColor;
    if (tpl.layout === "quote") {
      ctx.font = "bold 30px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
      ctx.fillText("“", 70, 220);
      ctx.font = "bold 62px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
      wrapText(ctx, headline, 70, 280, W - 140, 74);
    } else {
      ctx.font = "bold 84px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
      wrapText(ctx, headline, 70, 300, W - 140, 96);
    }

    ctx.font = "32px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
    ctx.fillStyle = tpl.textColor;
    ctx.globalAlpha = 0.85;
    wrapText(ctx, sub, 70, 620, W - 140, 44);
    ctx.globalAlpha = 1;

    // フッター
    ctx.font = "24px 'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
    ctx.fillStyle = tpl.accent;
    ctx.fillText("Shonan Innovation Base", 70, H - 100);
  }

  [tplSelect, headlineInput, subInput, labelInput].forEach((el) =>
    el.addEventListener("input", drawFeedImage)
  );
  tplSelect.addEventListener("change", drawFeedImage);

  document.getElementById("downloadBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "sib-feed-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // ---------- 初期描画 ----------
  document.getElementById("f-status").value = "idea";
  renderList();
  drawFeedImage();
})();
