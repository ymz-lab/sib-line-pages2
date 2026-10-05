"""Human-readable Markdown for reviewing drafts."""
from __future__ import annotations

from .schemas import Draft


def _tags(tags: list[str]) -> str:
    return " ".join(t if t.startswith("#") else f"#{t}" for t in tags)


def draft_to_markdown(d: Draft) -> str:
    p = d.plan
    out = [
        f"## [{d.status}] {d.id}",
        f"- 日時: {p.date} {p.time} / 形式: **{p.format}** / 柱: {p.pillar}",
        f"- 目的: {p.goal} / KPI: {p.kpi}",
        f"- テーマ: {p.theme}",
        f"- トレンド: {p.trend_angle}",
        f"- 参考: {p.reference_angle}",
        "",
    ]
    if d.reel:
        r = d.reel
        out += [f"### 🎬 {r.title}（{r.duration_sec}秒）", f"**フック:** {r.hook}", "",
                "| 時間 | 画 | テロップ | ナレーション |", "|---|---|---|---|"]
        out += [f"| {s.time} | {s.visual} | {s.telop} | {s.narration} |" for s in r.scenes]
        out += ["", f"**音源:** {r.audio_idea}", f"**カバー:** {r.cover_text}",
                "**撮影チェックリスト:**", *[f"- [ ] {c}" for c in r.shooting_checklist],
                "", "**キャプション:**", "", r.caption, "", _tags(r.hashtags)]
    if d.feed:
        f = d.feed
        out += [f"### 🖼 {f.title}"]
        for i, s in enumerate(f.slides, 1):
            out += [f"**{i}. {s.headline}**", s.body, f"_デザイン: {s.design_note}_", ""]
        out += ["**キャプション:**", "", f.caption, "", _tags(f.hashtags), f"_ALT: {f.alt_text}_"]
    if d.story:
        s = d.story
        out += [f"### 📱 {s.title}"]
        for i, fr in enumerate(s.frames, 1):
            sticker = "" if fr.sticker == "none" else f"（{fr.sticker}: {fr.sticker_detail}）"
            out += [f"{i}. {fr.text}{sticker}", f"   - 画: {fr.visual}"]
    if d.x:
        out += [f"### 𝕏 {d.x.title}"]
        for i, post in enumerate(d.x.posts, 1):
            out += [f"**{i}/{len(d.x.posts)}** ({len(post)}字)", "", post, ""]
    if d.media_urls:
        out += ["", "**素材URL:**", *[f"- {u}" for u in d.media_urls]]
    if d.published:
        out += ["", f"**投稿結果:** {d.published}"]
    return "\n".join(out) + "\n"
