"""Thin wrapper around the Claude API used by every step."""
from __future__ import annotations

import os
from typing import TypeVar

import anthropic
import yaml
from pydantic import BaseModel

MODEL = os.environ.get("SNS_AUTO_MODEL", "claude-opus-5-5")
# Server-side fallback: if a request is declined by a safety classifier, the API
# reroutes it to a suitable model inside the same call.
FALLBACK = {"betas": ["server-side-fallback-2026-07-01"], "fallbacks": "default"}
WEB_SEARCH_TOOL = {"type": "web_search_20260209", "name": "web_search", "max_uses": 10}
WEB_FETCH_TOOL = {"type": "web_fetch_20260209", "name": "web_fetch", "max_uses": 5}
MAX_PAUSE_RESUMES = 5

T = TypeVar("T", bound=BaseModel)

_client: anthropic.Anthropic | None = None


def client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client


class GenerationError(RuntimeError):
    pass


def system_blocks(cfg: dict) -> list[dict]:
    """Stable system prompt (brand + references), cached across every call in a run."""
    brand = yaml.safe_dump(cfg["brand"], allow_unicode=True, sort_keys=True)
    refs = yaml.safe_dump(cfg["references"], allow_unicode=True, sort_keys=True)
    text = f"""あなたは日本のSNSマーケティングに精通したコンテンツディレクターです。
以下のブランド設定に忠実に、Instagram（リール・フィード・ストーリー）とXの発信を企画・制作します。

原則:
- 目的（goals）とターゲットの悩み・欲求から逆算し、1投稿1メッセージ・CTAは1つに絞る。
- 数字や実績は key_facts に書かれているものだけを使う。存在しない実績・人物・コメントを創作しない。
- ng_words と tone.dont を守る。
- トレンドや参考アカウントは「型（構成・フック・尺・編集テンポ）」を借り、内容は自社の文脈に置き換える。他者の文章や動画をそのまま流用しない。
- 出力は自然な日本語。Xは全角140字以内を厳守。

<brand>
{brand}</brand>

<references>
{refs}</references>"""
    return [{"type": "text", "text": text, "cache_control": {"type": "ephemeral"}}]


def _check(msg) -> None:
    if msg.stop_reason == "refusal":
        raise GenerationError(f"モデルが生成を辞退しました: {getattr(msg, 'stop_details', None)}")
    if msg.stop_reason == "max_tokens":
        raise GenerationError("出力が max_tokens に達して途中で切れました。")


def research(cfg: dict, prompt: str) -> str:
    """Free-form research with web search/fetch. Returns markdown text."""
    messages: list = [{"role": "user", "content": prompt}]
    for _ in range(MAX_PAUSE_RESUMES + 1):
        with client().beta.messages.stream(
            model=MODEL,
            max_tokens=64000,
            system=system_blocks(cfg),
            messages=messages,
            tools=[WEB_SEARCH_TOOL, WEB_FETCH_TOOL],
            thinking={"type": "adaptive"},
            output_config={"effort": "high"},
            **FALLBACK,
        ) as stream:
            msg = stream.get_final_message()
        if msg.stop_reason != "pause_turn":
            break
        # Long server-tool turn was paused; send it back so the model continues.
        messages.append({"role": "assistant", "content": msg.content})
    else:
        raise GenerationError("Web検索が規定回数内に完了しませんでした。")
    _check(msg)
    return "".join(b.text for b in msg.content if b.type == "text").strip()


def structured(cfg: dict, prompt: str, schema: type[T], effort: str = "high") -> T:
    """Generate an object validated against `schema`."""
    with client().beta.messages.stream(
        model=MODEL,
        max_tokens=64000,
        system=system_blocks(cfg),
        messages=[{"role": "user", "content": prompt}],
        output_format=schema,
        thinking={"type": "adaptive"},
        output_config={"effort": effort},
        **FALLBACK,
    ) as stream:
        msg = stream.get_final_message()
    _check(msg)
    if msg.parsed_output is None:
        raise GenerationError("構造化出力のパースに失敗しました。")
    return msg.parsed_output
