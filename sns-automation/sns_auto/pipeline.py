"""research -> plan -> generate. Every step writes its result to workspace/."""
from __future__ import annotations

import datetime as dt
import json
from pathlib import Path

import yaml

from . import llm
from .config import DRAFTS_DIR, PLANS_DIR, RESEARCH_DIR, ensure_dirs, latest
from .schemas import DRAFT_SCHEMAS, ContentPlan, Draft, PlanItem


def _today() -> str:
    return dt.date.today().isoformat()


# ---------- 1. research ----------

def run_research(cfg: dict) -> Path:
    ensure_dirs()
    trends = yaml.safe_dump(cfg["trends"], allow_unicode=True, sort_keys=True)
    prompt = f"""今日は {_today()} です。Web検索を使い、直近2〜4週間のSNSトレンドを調査してください。

<manual_trends_and_focus>
{trends}</manual_trends_and_focus>

調査観点は research_focus に従ってください。references に公開URLがあれば、読める範囲で
構成やフックの特徴も確認してください（ログインが必要で読めない場合はメモの内容を使う）。

次の見出しで、Markdownのレポートを書いてください。各トレンドには根拠となる情報源のURLを添えること。
## 1. 今使えるフォーマット・型（リール/ストーリー/フィード/X）
## 2. 話題のテーマ・キーワード（ターゲット別）
## 3. 流行りの音源・編集テンポ（分かる範囲で。不確かなものは不確かと明記）
## 4. 参考アカウント/動画から抽出した勝ちパターン
## 5. 自社で使うべきトレンドTOP5（理由と、ブランドとの相性 ◎/○/△）
## 6. 避けるべきトレンド（ブランドに合わない・炎上リスク）"""
    report = llm.research(cfg, prompt)
    path = RESEARCH_DIR / f"{_today()}.md"
    path.write_text(f"# トレンドリサーチ {_today()}\n\n{report}\n", encoding="utf-8")
    return path


# ---------- 2. plan ----------

def run_plan(cfg: dict, start: str | None = None, days: int = 7,
             research_path: Path | None = None) -> Path:
    ensure_dirs()
    start = start or (dt.date.today() + dt.timedelta(days=1)).isoformat()
    research_path = research_path or latest(RESEARCH_DIR, "*.md")
    research_text = research_path.read_text(encoding="utf-8") if research_path else "（リサーチなし）"
    cadence = cfg["brand"].get("posting_cadence", {})
    scale = days / 7
    counts = {k: max(1, round(v * scale)) for k, v in cadence.items()}

    prompt = f"""{start} から {days} 日間の投稿カレンダーを作ってください。

本数: {json.dumps(counts, ensure_ascii=False)}（format別）
- content_pillars の share 比率に近づける
- goals の優先順に沿って、導線（LINE登録・イベント集客）につながる流れを1週間で設計する
- 同じ日に同じテーマを複数フォーマットで展開する場合は、役割（認知→信頼→行動）を分ける
- トレンドはリサーチの「自社で使うべきトレンド」から選び、無理に全部使わない

<research>
{research_text}
</research>"""
    plan = llm.structured(cfg, prompt, ContentPlan)
    path = PLANS_DIR / f"{start}.json"
    path.write_text(plan.model_dump_json(indent=2), encoding="utf-8")
    return path


# ---------- 3. generate ----------

FORMAT_GUIDE = {
    "reel": "Instagramリール。15〜45秒。冒頭1〜2秒のフック、テンポ良いカット割り、最後にCTA。"
            "実際に撮影できる内容にする（学生メンバーがスマホで撮れる前提）。",
    "feed": "Instagramフィード（カルーセル5〜8枚）。1枚目は保存したくなる表紙、最終枚にCTA。"
            "キャプションは最初の1行で続きを読ませる。",
    "story": "Instagramストーリー（3〜6フレーム）。スタンプで双方向性を作り、最後にリンク/行動導線。",
    "x": "Xのポスト。全角140字以内。単発か、価値が高い場合のみ3〜5件のスレッド。ハッシュタグは0〜2個。",
}


def _draft_id(item: PlanItem, index: int) -> str:
    return f"{item.date}_{index:02d}_{item.format}"


def run_generate(cfg: dict, plan_path: Path | None = None,
                 only: set[str] | None = None) -> list[Path]:
    ensure_dirs()
    plan_path = plan_path or latest(PLANS_DIR, "*.json")
    if not plan_path:
        raise llm.GenerationError("plan がありません。先に `plan` を実行してください。")
    plan = ContentPlan.model_validate_json(plan_path.read_text(encoding="utf-8"))
    research_path = latest(RESEARCH_DIR, "*.md")
    research_text = research_path.read_text(encoding="utf-8") if research_path else ""

    written = []
    for i, item in enumerate(plan.items, start=1):
        if only and item.format not in only:
            continue
        draft_id = _draft_id(item, i)
        path = DRAFTS_DIR / f"{draft_id}.json"
        if path.exists():  # never clobber a draft someone may have edited/approved
            continue
        prompt = f"""次の企画の投稿原稿を制作してください。

<format_guide>{FORMAT_GUIDE[item.format]}</format_guide>

<plan_item>
{item.model_dump_json(indent=2)}
</plan_item>

<week_summary>{plan.summary}</week_summary>

<research>
{research_text}
</research>"""
        body = llm.structured(cfg, prompt, DRAFT_SCHEMAS[item.format])
        draft = Draft(id=draft_id, plan=item, **{item.format: body})
        path.write_text(draft.model_dump_json(indent=2), encoding="utf-8")
        written.append(path)
    return written


# ---------- drafts I/O ----------

def load_draft(draft_id: str) -> tuple[Draft, Path]:
    path = DRAFTS_DIR / f"{draft_id}.json"
    if not path.exists():
        raise FileNotFoundError(f"draft が見つかりません: {draft_id}")
    return Draft.model_validate_json(path.read_text(encoding="utf-8")), path


def save_draft(draft: Draft, path: Path) -> None:
    path.write_text(draft.model_dump_json(indent=2), encoding="utf-8")


def all_drafts() -> list[Draft]:
    return [Draft.model_validate_json(p.read_text(encoding="utf-8"))
            for p in sorted(DRAFTS_DIR.glob("*.json"))]
