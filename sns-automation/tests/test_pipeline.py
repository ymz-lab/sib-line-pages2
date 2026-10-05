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

    monkeypatch.setattr(x, "_session", lambda: FakeSession())
    cli.main(["approve", "2020-01-01_02_x"])
    cli.main(["publish", "--yes"])
    assert posted == [{"text": "1つ目"},
                      {"text": "2つ目", "reply": {"in_reply_to_tweet_id": "1"}}]
    d = pipeline.load_draft("2020-01-01_02_x")[0]
    assert d.status == "published" and d.published["ids"] == ["1", "2"]
