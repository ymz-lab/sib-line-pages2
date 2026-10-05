"""Pull real account numbers from Instagram, X and LINE, and match posts to drafts.

Every source is optional: a platform whose credentials are not set is skipped.
"""
from __future__ import annotations

import datetime as dt
import os
import re
from zoneinfo import ZoneInfo

import requests

TZ = ZoneInfo(os.environ.get("SNS_TZ", "Asia/Tokyo"))
IG_BASE = os.environ.get("IG_GRAPH_BASE", "https://graph.facebook.com/v21.0")
X_BASE = "https://api.x.com/2"
LINE_BASE = "https://api.line.me/v2/bot"
IG_METRICS = ["views", "reach", "likes", "comments", "saved", "shares"]


def _local(ts: str) -> dt.datetime:
    return dt.datetime.fromisoformat(ts.replace("Z", "+00:00").replace("+0000", "+00:00")).astimezone(TZ)


def _get(url: str, **params) -> dict:
    res = requests.get(url, params=params, timeout=30)
    if res.status_code >= 300:
        raise RuntimeError(f"{url} {res.status_code}: {res.text[:300]}")
    return res.json()


# ---------- Instagram ----------

def _ig_insights(media_id: str, token: str) -> dict:
    """Insights for one media. Metric support varies by media type, so fall back one by one."""
    def parse(data):
        return {m["name"]: (m.get("values") or [{}])[0].get("value", m.get("total_value", {}).get("value"))
                for m in data.get("data", [])}
    try:
        return parse(_get(f"{IG_BASE}/{media_id}/insights", metric=",".join(IG_METRICS), access_token=token))
    except RuntimeError:
        out = {}
        for m in IG_METRICS:
            try:
                out.update(parse(_get(f"{IG_BASE}/{media_id}/insights", metric=m, access_token=token)))
            except RuntimeError:
                pass
        return out


def _ig_format(media: dict, story: bool) -> str:
    if story:
        return "story"
    if media.get("media_product_type") == "REELS" or media.get("media_type") == "VIDEO":
        return "reel"
    return "feed"


def fetch_instagram(limit: int = 50) -> tuple[dict, list[dict]]:
    user, token = os.environ.get("IG_USER_ID"), os.environ.get("IG_ACCESS_TOKEN")
    if not user or not token:
        return {}, []
    acct = _get(f"{IG_BASE}/{user}", fields="followers_count,media_count", access_token=token)
    fields = "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count"
    media = _get(f"{IG_BASE}/{user}/media", fields=fields, limit=limit, access_token=token).get("data", [])
    try:
        stories = _get(f"{IG_BASE}/{user}/stories", fields=fields, access_token=token).get("data", [])
    except RuntimeError:
        stories = []
    posts = []
    for m, story in [(m, False) for m in media] + [(m, True) for m in stories]:
        ins = _ig_insights(m["id"], token)
        when = _local(m["timestamp"])
        posts.append({
            "platform": "instagram", "id": m["id"], "format": _ig_format(m, story),
            "date": when.date().isoformat(), "time": when.strftime("%H:%M"),
            "text": m.get("caption") or "", "permalink": m.get("permalink", ""),
            "perf": _clean({
                "views": ins.get("views"), "reach": ins.get("reach"),
                "likes": ins.get("likes", m.get("like_count")), "comments": ins.get("comments", m.get("comments_count")),
                "saves": ins.get("saved"), "shares": ins.get("shares"),
            }),
        })
    return {"ig": acct.get("followers_count")}, posts


# ---------- X ----------

def fetch_x(limit: int = 50) -> tuple[dict, list[dict]]:
    keys = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"]
    if not all(os.environ.get(k) for k in keys):
        return {}, []
    from requests_oauthlib import OAuth1Session

    s = OAuth1Session(*(os.environ[k] for k in keys))

    def get(url, **params):
        res = s.get(url, params=params, timeout=30)
        if res.status_code >= 300:
            raise RuntimeError(f"{url} {res.status_code}: {res.text[:300]}")
        return res.json()

    me = get(f"{X_BASE}/users/me", **{"user.fields": "public_metrics"})["data"]
    tweets = get(f"{X_BASE}/users/{me['id']}/tweets", max_results=min(100, max(5, limit)),
                 exclude="retweets,replies", **{"tweet.fields": "created_at,public_metrics"}).get("data", [])
    posts = []
    for t in tweets:
        pm, when = t.get("public_metrics", {}), _local(t["created_at"])
        posts.append({
            "platform": "x", "id": t["id"], "format": "x",
            "date": when.date().isoformat(), "time": when.strftime("%H:%M"),
            "text": t.get("text", ""), "permalink": f"https://x.com/i/web/status/{t['id']}",
            "perf": _clean({
                "views": pm.get("impression_count"), "likes": pm.get("like_count"), "comments": pm.get("reply_count"),
                "shares": (pm.get("retweet_count") or 0) + (pm.get("quote_count") or 0), "saves": pm.get("bookmark_count"),
            }),
        })
    return {"x": me.get("public_metrics", {}).get("followers_count")}, posts


# ---------- LINE ----------

def fetch_line() -> dict:
    token = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN")
    if not token:
        return {}
    # LINE publishes the follower count for completed days only; try yesterday, then the day before.
    for back in (1, 2, 3):
        day = (dt.datetime.now(TZ).date() - dt.timedelta(days=back)).strftime("%Y%m%d")
        res = requests.get(f"{LINE_BASE}/insight/followers", params={"date": day},
                           headers={"Authorization": f"Bearer {token}"}, timeout=30)
        if res.status_code >= 300:
            raise RuntimeError(f"LINE {res.status_code}: {res.text[:300]}")
        body = res.json()
        if body.get("status") == "ready":
            return {"line": body.get("followers")}
    return {}


def fetch_all(limit: int = 50) -> dict:
    snapshot = {"date": dt.datetime.now(TZ).date().isoformat()}
    posts, errors = [], []
    for name, fn in (("instagram", fetch_instagram), ("x", fetch_x)):
        try:
            acct, p = fn(limit)
            snapshot.update(acct)
            posts += p
        except Exception as e:  # one platform failing must not lose the others
            errors.append(f"{name}: {e}")
    try:
        snapshot.update(fetch_line())
    except Exception as e:
        errors.append(f"line: {e}")
    return {"source": "baseai-sync", "fetched_at": dt.datetime.now(TZ).isoformat(timespec="seconds"),
            "snapshot": snapshot, "posts": posts, "errors": errors}


def _clean(d: dict) -> dict:
    return {k: v for k, v in d.items() if isinstance(v, (int, float))}


# ---------- matching to drafts ----------

def _bigrams(s: str) -> set[str]:
    s = re.sub(r"\s+", "", s or "")
    return {s[i:i + 2] for i in range(len(s) - 1)}


def similarity(a: str, b: str) -> float:
    A, B = _bigrams(a), _bigrams(b)
    if not A or not B:
        return 0.0
    return len(A & B) / min(len(A), len(B))


def _draft_text(d: dict) -> str:
    out: list[str] = []

    def walk(v):
        if isinstance(v, str):
            out.append(v)
        elif isinstance(v, list):
            for x in v:
                walk(x)
        elif isinstance(v, dict):
            for x in v.values():
                walk(x)
    walk(d.get("body") or {})
    return "\n".join(out)


def match_posts(posts: list[dict], drafts: list[dict]) -> list[tuple[dict, dict | None]]:
    """Pair each real post with the draft it came from: by published id, else same day + format + similar text."""
    by_pub = {}
    for d in drafts:
        for pid in (d.get("published") or {}).get("ids", []) or []:
            by_pub[str(pid)] = d
    used: set[str] = set()
    pairs = []
    for p in posts:
        d = by_pub.get(str(p["id"]))
        if d is None:
            cands = [d for d in drafts if d.get("id") not in used and (d.get("plan") or {}).get("date") == p["date"]
                     and d.get("format") == p["format"] and d.get("status") in ("approved", "published")]
            scored = sorted(((similarity(p["text"], _draft_text(d)), d) for d in cands), key=lambda x: -x[0])
            d = scored[0][1] if scored and scored[0][0] >= 0.3 else None
        if d is not None:
            used.add(d["id"])
        pairs.append((p, d))
    return pairs


def external_draft(p: dict) -> dict:
    """A record for a post made outside the tool, so it still counts in the KPI view."""
    title = re.sub(r"\s+", " ", p["text"]).strip()[:40] or f"{p['platform']} {p['id']}"
    return {
        "id": f"ext_{p['platform']}_{p['id']}", "status": "published", "format": p["format"], "source": "sync",
        "plan": {"date": p["date"], "time": p["time"], "format": p["format"], "pillar": "", "goal": "",
                 "theme": title, "trend_angle": "", "reference_angle": "", "kpi": ""},
        "body": {"title": title}, "media_urls": [], "notes": "", "permalink": p["permalink"],
        "published": {"platform": p["platform"], "ids": [p["id"]]}, "perf": p["perf"],
    }


def build_writes(result: dict, drafts: list[dict], metrics: list[dict] | None = None) -> list[dict]:
    """Writes for the UI's shared database (ArtifactData batch format).

    `drafts` / `metrics` are the current documents, each either a plain body or
    `{"id", "version", "data"}` as a database listing returns them; versions pin the writes.
    """
    def unwrap(items):
        out = []
        for it in items or []:
            if isinstance(it, dict) and "data" in it and "id" in it:
                out.append({**it["data"], "id": it["data"].get("id", it["id"]), "_version": it.get("version")})
            else:
                out.append(it)
        return out

    drafts, metrics = unwrap(drafts), unwrap(metrics)
    now = int(dt.datetime.now().timestamp() * 1000)
    writes: list[dict] = []

    snap = {k: v for k, v in result["snapshot"].items() if v is not None}
    if len(snap) > 1:
        prev = next((m for m in metrics if m.get("date") == snap["date"]), None)
        w = {"op": "set", "collection": "metrics", "doc_id": snap["date"],
             "data": {**{k: prev.get(k) for k in ("ig", "x", "line") if prev and prev.get(k) is not None},
                      **snap, "updatedAt": now, "source": "sync"}}
        if prev and prev.get("_version"):
            w["if_version"] = prev["_version"]
        writes.append(w)

    for p, d in match_posts(result["posts"], drafts):
        if d is None:
            writes.append({"op": "set", "collection": "drafts", "doc_id": external_draft(p)["id"],
                           "data": {**external_draft(p), "updatedAt": now}})
            continue
        w = {"op": "update", "collection": "drafts", "doc_id": d["id"],
             "data": {"perf": {**(d.get("perf") or {}), **p["perf"]}, "status": "published", "permalink": p["permalink"],
                      "published": {"platform": p["platform"], "ids": [p["id"]]}, "updatedAt": now}}
        if d.get("_version"):
            w["if_version"] = d["_version"]
        writes.append(w)
    # External records re-synced later must not duplicate: drop sets for ids that already exist.
    existing = {d.get("id") for d in drafts}
    return [w for w in writes if not (w["op"] == "set" and w["collection"] == "drafts" and w["doc_id"] in existing)]
