"""Offline end-to-end test: the Claude API is replaced by a mock HTTP transport."""
from __future__ import annotations

import json

import anthropic
import httpx2
import pytest

from sns_auto import cli, config, llm, pipeline
from sns_auto.schemas import FeedDraft, ReelDraft, StoryDraft, XDraft

PLAN = {
    "summary": "活動のリアルで認知を取り、週末のLINE登録につなげる",
    "items": [
        {"date": "2020-01-01", "time": "19:00", "format": "reel", "pillar": "活動のリアル",
         "goal": "認知拡大", "theme": "ピッチ当日の裏側", "trend_angle": "1日密着",
         "reference_angle": "冒頭テロップ", "kpi": "リーチ"},
        {"date": "2020-01-01", "time": "12:00", "format": "x", "pillar": "学生のキャリアのヒント",
         "goal": "LINE登録", "theme": "就活で語れる経験", "trend_angle": "なし",
         "reference_angle": "なし", "kpi": "クリック"},
        {"date": "2099-01-02", "time": "12:00", "format": "feed", "pillar": "企業・地域との共創",
         "goal": "協賛企業獲得", "theme": "協賛のメリット", "trend_angle": "なし",
         "reference_angle": "なし", "kpi": "保存"},
        {"date": "2099-01-02", "time": "21:00", "format": "story", "pillar": "参加・登録の導線",
         "goal": "LINE登録", "theme": "登録方法", "trend_angle": "なし",
         "reference_angle": "なし", "kpi": "リンククリック"},
    ],
}

BODIES = {
    "reel": ReelDraft(title="t", hook="h", duration_sec=20, scenes=[], audio_idea="a",
                      cover_text="c", caption="cap", hashtags=["SIB"], shooting_checklist=[]),
    "x": XDraft(title="t", posts=["1つ目", "2つ目"]),
    "feed": FeedDraft(title="t", slides=[], caption="cap", hashtags=[], alt_text="alt"),
    "story": StoryDraft(title="t", frames=[]),
}


def sse(text: str) -> bytes:
    events = [
        ("message_start", {"type": "message_start", "message": {
            "id": "msg_1", "type": "message", "role": "assistant", "model": llm.MODEL,
            "content": [], "stop_reason": None, "stop_sequence": None,
            "usage": {"input_tokens": 1, "output_tokens": 1}}}),
        ("content_block_start", {"type": "content_block_start", "index": 0,
                                 "content_block": {"type": "text", "text": ""}}),
        ("content_block_delta", {"type": "content_block_delta", "index": 0,
                                 "delta": {"type": "text_delta", "text": text}}),
        ("content_block_stop", {"type": "content_block_stop", "index": 0}),
        ("message_delta", {"type": "message_delta",
                           "delta": {"stop_reason": "end_turn", "stop_sequence": None},
                           "usage": {"output_tokens": 1}}),
        ("message_stop", {"type": "message_stop"}),
    ]
    return "".join(f"event: {e}\ndata: {json.dumps(d, ensure_ascii=False)}\n\n"
                   for e, d in events).encode()


@pytest.fixture
def env(tmp_path, monkeypatch):
    for name in ("RESEARCH_DIR", "PLANS_DIR", "DRAFTS_DIR"):
        sub = tmp_path / name.lower()
        monkeypatch.setattr(config, name, sub)
        monkeypatch.setattr(pipeline, name, sub)
    monkeypatch.setattr(config, "WORKSPACE", tmp_path)
    monkeypatch.setattr(cli, "WORKSPACE", tmp_path)

    requests_seen: list[dict] = []

    def handler(request: httpx2.Request) -> httpx2.Response:
        body = json.loads(request.content)
        requests_seen.append({"body": body, "beta": request.headers.get("anthropic-beta", "")})
        prompt = body["messages"][0]["content"]
        if body.get("tools"):
            text = "## 5. 自社で使うべきトレンドTOP5\n- 1日密着"
        elif "投稿カレンダー" in prompt:
            text = json.dumps(PLAN, ensure_ascii=False)
        else:
            fmt = next(f for f in BODIES if f'"format": "{f}"' in prompt)
            text = BODIES[fmt].model_dump_json()
        return httpx2.Response(200, content=sse(text),
                               headers={"content-type": "text/event-stream"})

    fake = anthropic.Anthropic(api_key="test",
                               http_client=httpx2.Client(transport=httpx2.MockTransport(handler)))
    monkeypatch.setattr(llm, "_client", fake)
    return tmp_path, requests_seen


def test_full_flow(env, capsys):
    tmp, seen = env
    cli.main(["weekly", "--start", "2020-01-01"])

    # research call uses web tools; generation calls use structured output
    research, plan_req, *gen = seen
    assert {t["type"] for t in research["body"]["tools"]} == {"web_search_20260209",
                                                                "web_fetch_20260209"}
    assert plan_req["body"]["output_config"]["format"]["type"] == "json_schema"
    assert plan_req["body"]["output_config"]["effort"] == "high"
    assert plan_req["body"]["fallbacks"] == "default"
    assert "server-side-fallback-2026-07-01" in plan_req["beta"]
    assert plan_req["body"]["system"][0]["cache_control"] == {"type": "ephemeral"}
    assert len(gen) == 4

    drafts = pipeline.all_drafts()
    assert [d.plan.format for d in drafts] == ["reel", "x", "feed", "story"]
    assert (tmp / "review.md").read_text(encoding="utf-8").count("## [draft]") == 4

    # re-running generate must not overwrite existing drafts
    cli.main(["generate"])
    assert len(seen) == 6

    cli.main(["approve", "2020-01-01_02_x", "2099-01-02_03_feed"])
    capsys.readouterr()
    cli.main(["publish"])  # dry-run, only due items
    out = capsys.readouterr().out
    assert "2020-01-01_02_x" in out and "2099-01-02_03_feed" not in out
    assert pipeline.load_draft("2020-01-01_02_x")[0].status == "approved"


def test_x_thread_publish(env, monkeypatch):
    from sns_auto.publishers import x

    cli.main(["weekly", "--start", "2020-01-01"])
    posted = []

    class FakeSession:
        def post(self, url, json, timeout):
            posted.append(json)
            return type("R", (), {"status_code": 201,
                                  "json": lambda self: {"data": {"id": str(len(posted))}}})()

    monkeypatch.setattr(x, "_session", lambda brand="student": FakeSession())
    cli.main(["approve", "2020-01-01_02_x"])
    cli.main(["publish", "--yes"])
    assert posted == [{"text": "1つ目"},
                      {"text": "2つ目", "reply": {"in_reply_to_tweet_id": "1"}}]
    d = pipeline.load_draft("2020-01-01_02_x")[0]
    assert d.status == "published" and d.published["ids"] == ["1", "2"]


def test_import_from_ui_export(env, tmp_path):
    exported = [{
        "id": "2020-01-01_01_x", "status": "approved",
        "plan": PLAN["items"][1], "x": {"title": "t", "posts": ["UIから"]},
        "media_urls": [], "notes": "",
    }]
    f = tmp_path / "baseai-approved.json"
    f.write_text(json.dumps(exported, ensure_ascii=False), encoding="utf-8")
    cli.main(["import", str(f)])
    d = pipeline.load_draft("2020-01-01_01_x")[0]
    assert d.status == "approved" and d.x.posts == ["UIから"]

    d.status = "published"
    pipeline.save_draft(d, pipeline.DRAFTS_DIR / f"{d.id}.json")
    cli.main(["import", str(f)])  # already published: must not be re-queued
    assert pipeline.load_draft("2020-01-01_01_x")[0].status == "published"


def test_sync_matching_and_writes(monkeypatch):
    from sns_auto import sync

    posts = [
        {"platform": "x", "id": "111", "format": "x", "date": "2026-10-01", "time": "12:00",
         "text": "SIBのピッチ当日の裏側を公開", "permalink": "p1", "perf": {"views": 900, "likes": 10}},
        {"platform": "instagram", "id": "222", "format": "reel", "date": "2026-10-02", "time": "19:00",
         "text": "アプリから直接投稿したリール", "permalink": "p2", "perf": {"views": 5000, "reach": 3000}},
        {"platform": "instagram", "id": "333", "format": "feed", "date": "2026-10-03", "time": "18:00",
         "text": "協賛企業のメリット5選", "permalink": "p3", "perf": {"reach": 800, "saves": 40}},
    ]
    drafts = [
        {"id": "student_2026-10-01_01_x", "version": 3, "data": {"id": "student_2026-10-01_01_x", "brand": "student", "status": "published", "format": "x",
         "plan": {"date": "2026-10-01"}, "body": {"posts": ["x"]}, "published": {"ids": ["111"]}}},
        {"id": "student_2026-10-03_02_feed", "version": 1, "data": {"id": "student_2026-10-03_02_feed", "brand": "student", "status": "approved", "format": "feed",
         "plan": {"date": "2026-10-03"}, "body": {"title": "協賛企業のメリット5選", "caption": "協賛のメリット"}}},
        # Same day/format/text but the other brand: must never be matched.
        {"id": "company_2026-10-03_01_feed", "version": 1, "data": {"id": "company_2026-10-03_01_feed", "brand": "company", "status": "approved", "format": "feed",
         "plan": {"date": "2026-10-03"}, "body": {"title": "協賛企業のメリット5選"}}},
    ]
    metrics = [{"id": "2026-10-05", "version": 4, "data": {"date": "2026-10-05", "accounts": {"company:instagram": 900}}}]
    result = {"brand": "student", "snapshot": {"date": "2026-10-05", "accounts": {"instagram": 1500, "x": 700, "line": None}}, "posts": posts}
    writes = sync.build_writes(result, drafts, metrics)
    by = {w["doc_id"]: w for w in writes}
    m = by["2026-10-05"]
    assert m["if_version"] == 4
    assert m["data"]["accounts"] == {"company:instagram": 900, "student:instagram": 1500, "student:x": 700}
    assert by["student_2026-10-01_01_x"]["if_version"] == 3 and by["student_2026-10-01_01_x"]["data"]["perf"]["views"] == 900
    assert by["student_2026-10-03_02_feed"]["data"]["status"] == "published"
    assert "company_2026-10-03_01_feed" not in by
    ext = by["ext_instagram_222"]
    assert ext["op"] == "set" and ext["data"]["brand"] == "student" and ext["data"]["perf"]["views"] == 5000

    drafts.append({"id": "ext_instagram_222", "version": 2, "data": ext["data"]})
    again = {w["doc_id"]: w for w in sync.build_writes(result, drafts, metrics)}
    assert again["ext_instagram_222"]["op"] == "update" and again["ext_instagram_222"]["if_version"] == 2


def test_credentials_are_per_brand(monkeypatch):
    from sns_auto.creds import env

    monkeypatch.setenv("IG_ACCESS_TOKEN", "legacy")
    monkeypatch.setenv("IG_ACCESS_TOKEN_COMPANY", "company-token")
    assert env("IG_ACCESS_TOKEN", "company") == "company-token"
    assert env("IG_ACCESS_TOKEN", "student") == "legacy"
    monkeypatch.delenv("IG_ACCESS_TOKEN_COMPANY")
    assert env("IG_ACCESS_TOKEN", "company") is None  # never borrows the student group's token


def test_sync_skips_unconfigured_platforms(monkeypatch):
    from sns_auto import sync

    for k in ["IG_USER_ID", "IG_ACCESS_TOKEN", "X_API_KEY", "LINE_CHANNEL_ACCESS_TOKEN",
              "IG_USER_ID_COMPANY", "IG_ACCESS_TOKEN_COMPANY", "X_API_KEY_COMPANY", "LINE_CHANNEL_ACCESS_TOKEN_COMPANY"]:
        monkeypatch.delenv(k, raising=False)
    r = sync.fetch_all("company")
    assert r["brand"] == "company" and r["posts"] == [] and r["errors"] == [] and r["snapshot"]["accounts"] == {}


def test_publish_skips_formats_without_api(env, capsys):
    from sns_auto.schemas import Draft

    d = Draft(id="company_2020-01-01_01_tiktok", brand="company", status="approved",
              plan={**PLAN["items"][0], "format": "tiktok"}, tiktok={"title": "t"})
    pipeline.DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    pipeline.save_draft(d, pipeline.DRAFTS_DIR / f"{d.id}.json")
    cli.main(["publish", "--yes", "--all-due"])
    assert "自動投稿に未対応" in capsys.readouterr().out
