"""Post to Instagram via the Graph API (content publishing).

Requirements: a Business/Creator account, IG_USER_ID and a long-lived IG_ACCESS_TOKEN
with instagram_content_publish permission. Media must be reachable at public URLs
(set them in the draft's `media_urls`). Interactive story stickers (polls, links,
questions) cannot be added via the API, so those are flagged for manual posting.
"""
from __future__ import annotations

import os
import time

import requests

from ..schemas import Draft

BASE = os.environ.get("IG_GRAPH_BASE", "https://graph.facebook.com/v21.0")
VIDEO_EXT = (".mp4", ".mov")


def _env() -> tuple[str, str]:
    user, token = os.environ.get("IG_USER_ID"), os.environ.get("IG_ACCESS_TOKEN")
    if not user or not token:
        raise RuntimeError("IG_USER_ID / IG_ACCESS_TOKEN が未設定です")
    return user, token


def _post(path: str, token: str, **params) -> dict:
    res = requests.post(f"{BASE}/{path}", data={**params, "access_token": token}, timeout=60)
    if res.status_code >= 300:
        raise RuntimeError(f"Instagram API エラー {res.status_code}: {res.text}")
    return res.json()


def _wait_ready(container_id: str, token: str, timeout_s: int = 600) -> None:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        res = requests.get(f"{BASE}/{container_id}",
                           params={"fields": "status_code", "access_token": token}, timeout=30)
        status = res.json().get("status_code")
        if status == "FINISHED":
            return
        if status == "ERROR":
            raise RuntimeError(f"メディア処理に失敗しました: {res.text}")
        time.sleep(10)
    raise TimeoutError("メディア処理がタイムアウトしました")


def _media(user: str, token: str, url: str, **extra) -> str:
    key = "video_url" if url.lower().split("?")[0].endswith(VIDEO_EXT) else "image_url"
    if key == "video_url" and "media_type" not in extra:
        extra["media_type"] = "VIDEO"
    return _post(f"{user}/media", token, **{key: url}, **extra)["id"]


def _caption(text: str, tags: list[str]) -> str:
    tags_text = " ".join(t if t.startswith("#") else f"#{t}" for t in tags)
    return f"{text}\n\n{tags_text}".strip()


def publish(draft: Draft) -> dict:
    user, token = _env()
    urls = draft.media_urls
    if not urls:
        raise ValueError("media_urls が空です。撮影/制作した素材の公開URLを draft に設定してください")
    fmt = draft.plan.format

    if fmt == "reel":
        cid = _post(f"{user}/media", token, media_type="REELS", video_url=urls[0],
                    caption=_caption(draft.reel.caption, draft.reel.hashtags))["id"]
        containers = [cid]
    elif fmt == "feed":
        caption = _caption(draft.feed.caption, draft.feed.hashtags)
        if len(urls) == 1:
            containers = [_media(user, token, urls[0], caption=caption)]
        else:
            children = [_media(user, token, u, is_carousel_item="true") for u in urls[:10]]
            for c in children:
                _wait_ready(c, token)
            containers = [_post(f"{user}/media", token, media_type="CAROUSEL",
                                children=",".join(children), caption=caption)["id"]]
    elif fmt == "story":
        containers = [_media(user, token, u, media_type="STORIES") for u in urls]
    else:
        raise ValueError(f"Instagram で扱えない形式です: {fmt}")

    ids = []
    for cid in containers:
        _wait_ready(cid, token)
        ids.append(_post(f"{user}/media_publish", token, creation_id=cid)["id"])
    result = {"platform": "instagram", "ids": ids}
    if fmt == "story" and any(f.sticker != "none" for f in draft.story.frames):
        result["warning"] = "スタンプ（投票/リンク等）はAPIで付与できないため、アプリで追加してください"
    return result
