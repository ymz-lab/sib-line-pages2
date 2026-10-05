"""Command-line entry point: python -m sns_auto <command>."""
from __future__ import annotations

import argparse
import datetime as dt
import sys

from . import pipeline
from .config import WORKSPACE, load_all
from .render import draft_to_markdown


def cmd_research(args, cfg):
    print(f"✅ リサーチ: {pipeline.run_research(cfg)}")


def cmd_plan(args, cfg):
    print(f"✅ 投稿計画: {pipeline.run_plan(cfg, start=args.start, days=args.days)}")


def cmd_generate(args, cfg):
    only = set(args.only.split(",")) if args.only else None
    paths = pipeline.run_generate(cfg, only=only)
    print(f"✅ 原稿 {len(paths)} 件を生成しました")
    cmd_review(args, cfg)


def cmd_weekly(args, cfg):
    cmd_research(args, cfg)
    cmd_plan(args, cfg)
    cmd_generate(args, cfg)


def cmd_review(args, cfg):
    drafts = pipeline.all_drafts()
    md = "# 投稿原稿レビュー\n\n" + "\n---\n\n".join(draft_to_markdown(d) for d in drafts)
    out = WORKSPACE / "review.md"
    out.write_text(md, encoding="utf-8")
    print(f"📝 レビュー用: {out}")
    for d in drafts:
        print(f"  [{d.status:9}] {d.id}  {d.plan.theme}")


def _set_status(draft_id: str, status: str):
    draft, path = pipeline.load_draft(draft_id)
    draft.status = status
    pipeline.save_draft(draft, path)
    print(f"{draft_id} → {status}")


def cmd_approve(args, cfg):
    for i in args.ids:
        _set_status(i, "approved")


def cmd_reject(args, cfg):
    for i in args.ids:
        _set_status(i, "rejected")


def cmd_media(args, cfg):
    draft, path = pipeline.load_draft(args.id)
    draft.media_urls = args.urls
    pipeline.save_draft(draft, path)
    print(f"{args.id}: 素材URLを {len(args.urls)} 件設定しました")


def cmd_import(args, cfg):
    """Load drafts exported from the web UI (JSON array of Draft objects)."""
    import json
    from pathlib import Path

    from .config import DRAFTS_DIR, ensure_dirs
    from .schemas import Draft

    ensure_dirs()
    items = json.loads(Path(args.file).read_text(encoding="utf-8"))
    added = skipped = 0
    for raw in items:
        draft = Draft.model_validate(raw)
        path = DRAFTS_DIR / f"{draft.id}.json"
        if path.exists() and Draft.model_validate_json(path.read_text(encoding="utf-8")).status == "published":
            skipped += 1  # never re-queue something already posted
            continue
        pipeline.save_draft(draft, path)
        added += 1
    print(f"✅ {added} 件を取り込みました（投稿済みのためスキップ: {skipped} 件）")


def cmd_sync(args, cfg):
    """Fetch real numbers from Instagram / X / LINE for the UI's KPI view."""
    import json
    from pathlib import Path

    from . import sync

    args.out = args.out or f"baseai-sync-{args.brand}.json"
    result = sync.fetch_all(brand=args.brand, limit=args.limit)
    Path(args.out).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    accounts = result["snapshot"]["accounts"]
    print(f"✅ {args.out}（{args.brand}）: 投稿 {len(result['posts'])} 件 / フォロワー等 "
          + (", ".join(f"{k}={v}" for k, v in accounts.items()) or "なし（認証情報が未設定）"))
    for e in result["errors"]:
        print(f"⚠️ {e}", file=sys.stderr)
    if args.writes:
        load = lambda f: json.loads(Path(f).read_text(encoding="utf-8")) if f else []
        writes = sync.build_writes(result, load(args.drafts), load(args.metrics))
        Path(args.writes).write_text(json.dumps(writes, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✅ {args.writes}: 共有データへの書き込み {len(writes)} 件")


def cmd_publish(args, cfg):
    from .publishers import instagram, x

    now = dt.datetime.now()
    targets = [d for d in pipeline.all_drafts() if d.status == "approved"]
    if args.id:
        targets = [d for d in targets if d.id in args.id]
    if not args.all_due:
        # Default: only posts whose scheduled time has arrived.
        targets = [d for d in targets
                   if dt.datetime.fromisoformat(f"{d.plan.date}T{d.plan.time}") <= now]
    if not targets:
        print("投稿対象（approved かつ予定時刻到来）はありません")
        return
    from .schemas import AUTO_PUBLISH

    for d in targets:
        if d.plan.format not in AUTO_PUBLISH:
            print(f"⏭ {d.id}: {d.plan.format} は自動投稿に未対応です。アプリから投稿してください")
            continue
        if not args.yes:
            print(f"[dry-run] {d.id} を投稿します（実際に投稿するには --yes）")
            continue
        try:
            result = (x if d.plan.format == "x" else instagram).publish(d)
        except Exception as e:  # keep going with the other posts
            print(f"❌ {d.id}: {e}", file=sys.stderr)
            continue
        draft, path = pipeline.load_draft(d.id)
        draft.status, draft.published = "published", result
        pipeline.save_draft(draft, path)
        print(f"🚀 {d.id}: {result}")


def main(argv=None):
    p = argparse.ArgumentParser(prog="sns_auto", description="BaseAI SNS自動化ツール（株式会社BaseAI）")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("research", help="Web検索でトレンドを調査").set_defaults(fn=cmd_research)

    for name, fn, help_ in (("plan", cmd_plan, "投稿カレンダーを作成"),
                            ("weekly", cmd_weekly, "research→plan→generate を一括実行")):
        sp = sub.add_parser(name, help=help_)
        sp.add_argument("--start", help="開始日 YYYY-MM-DD（既定: 明日）")
        sp.add_argument("--days", type=int, default=7)
        sp.add_argument("--only", help="生成する形式を限定 例: reel,x")
        sp.set_defaults(fn=fn)

    sp = sub.add_parser("generate", help="計画から各投稿の原稿を生成")
    sp.add_argument("--only", help="生成する形式を限定 例: reel,x")
    sp.set_defaults(fn=cmd_generate)

    sub.add_parser("review", help="原稿一覧と review.md を出力").set_defaults(fn=cmd_review)

    for name, fn in (("approve", cmd_approve), ("reject", cmd_reject)):
        sp = sub.add_parser(name, help=f"原稿を {name} にする")
        sp.add_argument("ids", nargs="+")
        sp.set_defaults(fn=fn)

    sp = sub.add_parser("media", help="Instagram用の素材URLを設定")
    sp.add_argument("id")
    sp.add_argument("urls", nargs="+")
    sp.set_defaults(fn=cmd_media)

    sp = sub.add_parser("import", help="Web UIから書き出したJSONを取り込む")
    sp.add_argument("file")
    sp.set_defaults(fn=cmd_import)

    sp = sub.add_parser("sync", help="Instagram / X / LINE の実数値を取得（UIの成果・KPIに取り込み）")
    sp.add_argument("--out", default=None, help="出力ファイル（既定: baseai-sync-<brand>.json）")
    sp.add_argument("--brand", choices=["company", "student"], default="company", help="company=株式会社BaseAI / student=学生団体SIB")
    sp.add_argument("--limit", type=int, default=50, help="取得する直近の投稿数")
    sp.add_argument("--writes", help="UIの共有データ用の書き込みリストを出力するファイル")
    sp.add_argument("--drafts", help="現在の原稿一覧（JSON配列）。照合に使う")
    sp.add_argument("--metrics", help="現在のアカウント数値（JSON配列）")
    sp.set_defaults(fn=cmd_sync)

    sp = sub.add_parser("publish", help="承認済みで予定時刻を過ぎた投稿を公開")
    sp.add_argument("--id", nargs="*", help="対象を限定")
    sp.add_argument("--all-due", action="store_true", help="予定時刻に関係なく承認済みを全て対象")
    sp.add_argument("--yes", action="store_true", help="実際に投稿する（無指定時は dry-run）")
    sp.set_defaults(fn=cmd_publish)

    args = p.parse_args(argv)
    args.fn(args, load_all())


if __name__ == "__main__":
    main()
