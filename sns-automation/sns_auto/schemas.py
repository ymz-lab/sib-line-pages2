"""Structured-output schemas for plans and per-format drafts."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

Format = Literal["reel", "feed", "story", "x", "threads", "tiktok", "youtube"]
# Formats the CLI can post automatically; the rest are posted by hand from the UI.
AUTO_PUBLISH = {"reel", "feed", "story", "x"}


# ---------- Plan ----------

class PlanItem(BaseModel):
    date: str = Field(description="投稿予定日 YYYY-MM-DD")
    time: str = Field(description="投稿推奨時刻 HH:MM（ターゲットが見る時間帯）")
    format: Format
    pillar: str = Field(description="brand.yaml の content_pillars の name のいずれか")
    goal: str = Field(description="brand.yaml の goals のうち、この投稿が狙うもの")
    theme: str = Field(description="投稿テーマを一文で")
    trend_angle: str = Field(description="活用するトレンド/フォーマットと、その使い方。使わない場合は「なし」")
    reference_angle: str = Field(description="参考アカウント・動画から借りる要素。なければ「なし」")
    kpi: str = Field(description="主に見る指標（保存数、LINE登録、リーチ等）")


class ContentPlan(BaseModel):
    summary: str = Field(description="今週の発信方針を3行以内で")
    items: list[PlanItem]


# ---------- Drafts ----------

class ReelScene(BaseModel):
    time: str = Field(description="例: 0-2s")
    visual: str = Field(description="撮影する画・カメラワーク")
    telop: str = Field(description="画面テロップ")
    narration: str = Field(description="話す内容/ナレーション。なければ空文字")


class ReelDraft(BaseModel):
    title: str
    hook: str = Field(description="冒頭1〜2秒で離脱を防ぐフック")
    duration_sec: int
    scenes: list[ReelScene]
    audio_idea: str = Field(description="BGM/トレンド音源の方向性")
    cover_text: str = Field(description="カバー画像の文字")
    caption: str
    hashtags: list[str]
    shooting_checklist: list[str] = Field(description="撮影時に必要な素材・人・場所")


class FeedSlide(BaseModel):
    headline: str
    body: str
    design_note: str = Field(description="レイアウト・写真・配色の指示")


class FeedDraft(BaseModel):
    title: str
    slides: list[FeedSlide] = Field(description="カルーセル。1枚目は保存/スワイプを促す表紙")
    caption: str
    hashtags: list[str]
    alt_text: str


class StoryFrame(BaseModel):
    visual: str
    text: str
    sticker: Literal["none", "poll", "quiz", "question", "link", "countdown", "slider"]
    sticker_detail: str = Field(description="スタンプの設問・選択肢・リンク先など。none の場合は空文字")


class StoryDraft(BaseModel):
    title: str
    frames: list[StoryFrame]


class XDraft(BaseModel):
    title: str
    posts: list[str] = Field(
        description="1件なら単発ポスト、複数ならスレッド。各要素は全角140字以内（URL含む）"
    )


class Draft(BaseModel):
    """A plan item plus its generated body; this is what gets reviewed and published."""

    id: str
    brand: Literal["company", "student"] = "student"
    status: Literal["draft", "approved", "published", "rejected"] = "draft"
    plan: PlanItem
    reel: Optional[ReelDraft] = None
    feed: Optional[FeedDraft] = None
    story: Optional[StoryDraft] = None
    x: Optional[XDraft] = None
    # Formats written in the web UI; kept as-is for export and manual posting.
    threads: Optional[dict] = None
    tiktok: Optional[dict] = None
    youtube: Optional[dict] = None
    # Filled in by a human after shooting/designing: public URLs Instagram can fetch.
    media_urls: list[str] = Field(default_factory=list)
    published: dict = Field(default_factory=dict)
    notes: str = ""

    def body(self):
        return getattr(self, self.plan.format)


DRAFT_SCHEMAS: dict[str, type[BaseModel]] = {
    "reel": ReelDraft,
    "feed": FeedDraft,
    "story": StoryDraft,
    "x": XDraft,
}
