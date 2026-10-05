"""Post to X via API v2 (OAuth 1.0a user context)."""
from __future__ import annotations

import os

from requests_oauthlib import OAuth1Session

from ..schemas import Draft

ENDPOINT = "https://api.x.com/2/tweets"


def _session() -> OAuth1Session:
    keys = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"]
    missing = [k for k in keys if not os.environ.get(k)]
    if missing:
        raise RuntimeError(f"X の認証情報が未設定です: {', '.join(missing)}")
    return OAuth1Session(*(os.environ[k] for k in keys))


def publish(draft: Draft) -> dict:
    if not draft.x:
        raise ValueError("X の原稿がありません")
    session = _session()
    ids: list[str] = []
    for text in draft.x.posts:
        payload: dict = {"text": text}
        if ids:  # subsequent posts form a thread
            payload["reply"] = {"in_reply_to_tweet_id": ids[-1]}
        res = session.post(ENDPOINT, json=payload, timeout=30)
        if res.status_code >= 300:
            raise RuntimeError(f"X API エラー {res.status_code}: {res.text}")
        ids.append(res.json()["data"]["id"])
    return {"platform": "x", "ids": ids}
