# SNS発信 自動化ツール（SIB向け）

自社アカウントの方向性・目的（`config/brand.yaml`）を土台に、参考アカウント・動画（`config/references.yaml`）と
最新トレンド（Web検索 + `config/trends.yaml`）から、**リール / フィード / ストーリー / X** の投稿を企画・制作し、
承認後に自動投稿するツールです。生成には Claude API を使います。

```
 brand.yaml ─┐
 references ─┼─▶ ① research ─▶ ② plan ─▶ ③ generate ─▶ ④ review/approve ─▶ ⑤ publish
 trends.yaml ┘   Web検索で       1週間の     形式別の       人が確認・承認     X: 全自動
                 トレンド調査    投稿計画     原稿・台本     (素材URL設定)     IG: 素材URLが必要
```

| ステップ | 出力 | 内容 |
|---|---|---|
| ① research | `workspace/research/日付.md` | Z世代・就活・湘南エリアなどのトレンド、伸びている型、使うべき/避けるべきトレンド（出典URL付き） |
| ② plan | `workspace/plans/開始日.json` | 投稿カレンダー（日時・形式・発信の柱・目的・KPI・使うトレンド） |
| ③ generate | `workspace/drafts/*.json` | リール台本（カット割り・テロップ・音源・撮影チェックリスト）、カルーセル各スライド、ストーリー（スタンプ設計）、Xポスト/スレッド |
| ④ review | `workspace/review.md` | 全原稿を一覧できるレビュー用Markdown |
| ⑤ publish | — | 承認済み・予定時刻到来の投稿を X / Instagram に投稿 |

## Web UI（SIB SNSスタジオ）

ブラウザで使えるUI: https://claude.ai/artifact/AoAMTaxbxt23r1st98gEJu （ソース: `ui/index.html`）

- 方向性の設定 → トレンド分析 → 投稿計画 → 原稿生成 → 承認 までをブラウザで操作できます。
- データはチームで共有され、編集はリアルタイムに反映されます。AI生成は開いた人の claude.ai アカウントで動くため APIキーは不要です。
- 開くには claude.ai へのログインと、右上の「共有」からのアクセス付与が必要です（編集させたい人は Contributor 以上）。
- UIのトレンド分析はWeb検索を行いません。最新のバズは「気になっているトレンド」に書き足すか、CLIの `research` を使ってください。
- 承認済みの原稿は「投稿・書き出し」から JSON を保存し、`python -m sns_auto import sib-approved.json` で取り込めば `publish` で自動投稿できます。

## セットアップ

```bash
cd sns-automation
pip install -r requirements.txt
cp .env.example .env   # 各APIキーを記入し、export して使う（例: set -a; source .env; set +a）
```

- **Claude API**: `ANTHROPIC_API_KEY`（または `ant auth login`）。モデルは既定で `claude-opus-5-5`、`SNS_AUTO_MODEL` で変更可。
  安全分類器で辞退された場合に別モデルで自動再実行する server-side fallback を有効にしています。
- **X**: Developer Portal で Read and Write 権限のアプリを作り、OAuth 1.0a の4つのキーを設定。
- **Instagram**: ビジネス/クリエイターアカウント + Facebookページ連携、`instagram_content_publish` 権限付きの長期トークン。

## 使い方

```bash
# 1. 方向性を書く（最重要）
vi config/brand.yaml        # 目的・ターゲット・トーン・発信の柱・使ってよい実績(key_facts)
vi config/references.yaml   # 参考アカウント/動画と「なぜ参考にするか」、可能なら文字起こし

# 2. 1週間分を一括生成（research → plan → generate）
python -m sns_auto weekly
#   個別実行: research / plan --start 2026-10-12 --days 7 / generate --only reel,x

# 3. 確認・承認
open workspace/review.md
python -m sns_auto approve 2026-10-12_01_reel 2026-10-12_02_x
python -m sns_auto reject  2026-10-13_05_feed      # 不採用
#   原稿の修正は workspace/drafts/*.json を直接編集

# 4. Instagram は撮影/制作した素材の公開URLを登録（Xは不要）
python -m sns_auto media 2026-10-12_01_reel https://example.com/reel.mp4
python -m sns_auto media 2026-10-14_04_feed https://.../1.jpg https://.../2.jpg

# 5. 投稿（--yes なしは dry-run）
python -m sns_auto publish          # 予定時刻を過ぎた approved を確認
python -m sns_auto publish --yes    # 実際に投稿
```

## 定期実行（例: GitHub Actions）

`publish --yes` を1時間ごと、`weekly` を週1回動かせば「月曜に1週間分が届く → 承認するだけ」の運用になります。
`workspace/` は `.gitignore` 済みなので、Actionsで回す場合は workspace をコミットする/Artifactsやストレージに置くなど保存先を決めてください。

```yaml
on:
  schedule:
    - cron: "0 0 * * 1"   # 毎週月曜 9:00 JST に weekly
    - cron: "5 * * * *"   # 毎時 publish
jobs:
  run:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: sns-automation } }
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: python -m sns_auto ${{ github.event.schedule == '0 0 * * 1' && 'weekly' || 'publish --yes' }}
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          X_API_KEY: ${{ secrets.X_API_KEY }}
          # ...他のキーも同様
```

## 制約・注意

- **動画は直接視聴できません。** 参考動画は `references.yaml` に構成メモや文字起こしを書くと精度が上がります。
  Instagram/TikTok/X の多くのページはログイン必須のため、Web取得できない場合はメモの内容を使います。
- **トレンド音源**は検索で分かる範囲の情報です。実際に使う音源はアプリ内で確認してください。
- **ストーリーのスタンプ**（投票・リンク・質問）は API で付けられないため、投稿後にアプリで追加が必要です（publish 時に警告表示）。
- 生成AIの原稿は**必ず人が確認してから承認**してください。数字・実績は `key_facts` に書いたものだけを使うよう指示していますが、最終確認は人が行う前提の設計です。
- X API は有料プランの投稿上限、Instagram は24時間あたりの投稿上限（API経由）に注意してください。

## テスト

```bash
pip install pytest && python -m pytest -q tests   # Claude/X API はモックするのでキー不要
```
