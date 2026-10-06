# BaseAI SNS自動化ツール

株式会社BaseAI のSNS発信 自動化ツールです。

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
| ① research | `workspace/research/日付.md` | ターゲット層・業界・地域のトレンド、伸びている型、使うべき/避けるべきトレンド（出典URL付き） |
| ② plan | `workspace/plans/開始日.json` | 投稿カレンダー（日時・形式・発信の柱・目的・KPI・使うトレンド） |
| ③ generate | `workspace/drafts/*.json` | リール台本（カット割り・テロップ・音源・撮影チェックリスト）、カルーセル各スライド、ストーリー（スタンプ設計）、Xポスト/スレッド |
| ④ review | `workspace/review.md` | 全原稿を一覧できるレビュー用Markdown |
| ⑤ publish | — | 承認済み・予定時刻到来の投稿を X / Instagram に投稿 |

## Web UI（BaseAI SNSスタジオ）

ブラウザで使えるUI: https://claude.ai/artifact/AoAMTaxbxt23r1st98gEJu （ソース: `ui/index.html`）

- 方向性の設定 → トレンド分析 → 投稿計画 → 原稿生成 → 承認 までをブラウザで操作できます。
- データはチームで共有され、編集はリアルタイムに反映されます。AI生成は開いた人の claude.ai アカウントで動くため APIキーは不要です。
- 開くには claude.ai へのログインと、右上の「共有」からのアクセス付与が必要です（編集させたい人は Contributor 以上）。
- **適合度チェック**: 原稿ごとに「KPI・目的／ターゲット／トーン／発信の柱／CTA／事実」の6観点でAIが採点し、NGワード・Xの字数超過・設定にない数字・LINE導線の欠落はプログラムで検出します。基準（80点）未満は「ミスマッチを修正」で書き直せ、生成時の自動修正もできます。
- **計画の検証**: 形式ごとの本数・発信の柱の比率・目的のカバー・遅れているKPIへの対応を集計し、ズレを自動修正します。
- **成果・KPI**: 月間KPI目標の達成率と今日時点のペース、フォロワー/友だち数の推移、投稿ごとの再生数、形式別・柱別の成果を表示。「AIで振り返る」の結果は次の計画と原稿に反映されます。数値はアカウントのフォロワー数と各投稿のインサイトを画面から入力します。
- UIのトレンド分析はWeb検索を行いません。最新のバズは「気になっているトレンド」に書き足すか、CLIの `research` を使ってください。
- 承認済みの原稿は「投稿・書き出し」から JSON を保存し、`python -m sns_auto import baseai-approved.json` で取り込めば `publish` で自動投稿できます。

## 運用アカウント

| 運用元 | SNS | アカウント |
|---|---|---|
| 株式会社BaseAI | TikTok | [@baseai71](https://www.tiktok.com/@baseai71) |
| 株式会社BaseAI | YouTube | [UCUMbHkUIUvoLphvXraYbqwA](https://www.youtube.com/channel/UCUMbHkUIUvoLphvXraYbqwA) |
| 株式会社BaseAI | Threads | [@sib_business0427](https://www.threads.com/@sib_business0427) |
| 株式会社BaseAI | Instagram | [@kabu_baseai0901](https://www.instagram.com/kabu_baseai0901) |
| 株式会社BaseAI | X | [@kabubaseai](https://x.com/kabubaseai) |
| 学生団体SIB | Threads | [@gakuseidantai_sib](https://www.threads.com/@gakuseidantai_sib) |
| 学生団体SIB | Instagram | [@gakuseidantai_sib](https://www.instagram.com/gakuseidantai_sib) |
| 学生団体SIB | X | [@sib2021494](https://x.com/sib2021494) |

一覧の元データは `config/accounts.yaml`、UIでは「方向性・KPI → 運用アカウント」で編集できます。

## ブランド別の運用とカレンダー

- UI左上で **BaseAI（会社）／SIB（学生団体）** を切り替えます。方向性・KPI・トレンド分析・投稿計画・原稿・成果はブランドごとに分かれ、フォロワー数も「ブランド × SNS」ごとに記録・集計されます。成果・KPI画面には両ブランドの比較も表示されます。
- 投稿形式はリール・フィード・ストーリー・X に加え、**TikTok・YouTube・Threads** に対応しました（各ブランドの運用アカウントにある形式だけが選ばれます）。自動投稿は Instagram と X のみで、ほかはUIからコピーしてアプリで投稿します。
- **カレンダー**で、日ごとの予定と「素材（●完成／◐制作中／○未着手／–不要）」「状態（予定／原稿／承認／投稿済）」を一覧できます。予定日を過ぎて未投稿のものは赤枠です。「両ブランドを表示」で会社と学生団体をまとめて見られます。素材の状況は原稿画面で設定します。

## 自動運用（人は判断だけ）

- 毎朝 6:47（日本時間）に Claude のルーティンが実行され、ブランドごとに次を行います。手順は `AUTOPILOT.md`。
  1. Web検索で参考動画・参考ストーリー・トレンド・音源の傾向・参考アカウントを集める（出典URL付き）
  2. 計画が7日先まで無ければ7日分の計画をつくる
  3. 計画に沿って原稿（KPI・方針への適合度付き）と、ストーリー・フィードの画像を下書きする
- UIの「ホーム（判断）」で、新着の参考を採用／不採用、原稿・画像を承認するだけで運用できます。採用した参考は次の企画に反映されます。
- 手動で投稿するもの（Instagram・TikTok・YouTube・Threads、APIの認証情報が無いX）は、ホームの「投稿キット」でコピーと画像の保存だけで投稿し、「投稿した」を押します。
- 方向性・KPIが空のブランドは、参考集めだけ行います。
- **確実性の設定**（方向性・KPI → 品質と確実性）: 承認できる適合度の基準（既定85点）、基準未満は編集者以外承認不可、ダブルチェック（2人承認）、新しい試みの上限（既定20%。残りは成果の出た型で組む）、画像ストックの目標日数。自動運用もこの基準で下書きします。
- ホームには KPI ごとの「目標まであと○○・残り日数・1日あたり必要数・このペースでの月末見込み」と、明日の未承認・画像不足・遅れ・KPI遅れの警告が出ます。
- 素材フォルダ（Googleドライブ等）のリンクは、ブランド単位（方向性・KPI）と投稿単位（原稿画面）で設定でき、投稿キットから開けます。

## クリエイティブ（画像）の自動生成とストック

- 「クリエイティブ」画面で、ストーリー（1080×1920）・フィード（1080×1350）の画像を、方向性・トレンド分析・原稿に沿ってAIがデザインし、ツール内で描画します（APIキー不要）。
- 「不足分をまとめて生成」で、今日から7/14/30日間の予定のうち画像がないものを日付順に生成してストックします。日別ストックの帯と「◯日分まで確保」で在庫が分かり、カレンダーの「素材」にも反映されます。
- 画像ごとに型（大見出し・写真・リスト・引用・行動導線）、文字、配色、書体、背景写真を編集でき、承認・PNG保存・ZIPでのまとめて保存ができます。写真は「写真ライブラリ」に追加します（ブランドごと）。
- ブランドの色・書体は「方向性・KPI → ビジュアル」で設定します。
- 次の段階で ChatGPT（OpenAI の画像生成）による写真・イラスト生成を追加予定です。OpenAI APIキーをクラウド環境に登録し、`api.openai.com` への通信を許可する必要があります。

## 実際のアカウントとの連携

`sync` コマンドで Instagram・X・LINE の実数値を取得し、UIの「成果・KPI → アカウント連携」から取り込みます。

```bash
python -m sns_auto sync --brand company   # 会社 → baseai-sync-company.json
python -m sns_auto sync --brand student   # 学生団体 → baseai-sync-student.json
# → UIの「連携データを取り込む」でファイルを選ぶ（ブランドはファイルから自動判定）
```

| サービス | 取得する数値 | 必要な環境変数 |
|---|---|---|
| Instagram（ビジネス/クリエイター） | フォロワー数、直近の投稿・ストーリーの再生・リーチ・いいね・コメント・保存・シェア | `IG_USER_ID`, `IG_ACCESS_TOKEN`（`instagram_basic`, `instagram_manage_insights` 権限。投稿もするなら `instagram_content_publish`） |
| X | フォロワー数、直近のポストの表示・いいね・返信・リポスト・ブックマーク | `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`（読み取りに対応したプラン） |
| LINE公式アカウント | 友だち数（前日分） | `LINE_CHANNEL_ACCESS_TOKEN`（Messaging API のチャネルアクセストークン） |

- 認証情報はブランドごとに末尾を付けて設定します（例: `IG_ACCESS_TOKEN_COMPANY`, `X_API_KEY_STUDENT`）。末尾なしの名前は学生団体として扱い、会社のアカウントには使いません。投稿（`publish`）も原稿のブランドの認証情報を使います。
- ツールで作った原稿は、投稿IDまたは「同じ日・同じ形式・本文が近い」で自動的に紐づきます。アプリから直接投稿したものは「アプリから投稿」として集計されます。
- 同じファイルを何度取り込んでも重複しません。

### 毎日の自動連携（Claude のルーティン）

Claude Code のクラウド環境で毎日 `sync` → UIの共有データへの書き込み、承認済み原稿の予約投稿まで自動で回せます。準備:

1. クラウド環境の設定（セッションのタイトルバーの環境メニュー → Edit）で、上の環境変数を追加する
2. 同じ設定の Network access を Custom にし、`graph.facebook.com`・`api.x.com`・`api.line.me` を Allowed domains に追加する
3. Claude に「自動連携のルーティンを作って」と依頼する

`sync --writes writes.json --drafts drafts.json --metrics metrics.json` で、共有データへの書き込みリスト（照合済み・バージョン付き）を出力できます。

## チームでの利用（第三者の入力）

UIは共有メニューの権限で操作が分かれます。

| 権限 | できること |
|---|---|
| オーナー・編集者（Editor） | すべて。方向性・KPI目標の変更はこの権限のみ |
| 参加者（Contributor） | 分析・計画・原稿の作成と編集、承認、成果の入力、連携データの取り込み |
| 閲覧者・公開リンクの訪問者 | 閲覧のみ |

社外の方はページ右上の「共有」からメールで招待します。利用には claude.ai へのログインが必要で、AIの生成は操作した人のアカウントで実行されます。原稿には最終更新者が記録されます。

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
