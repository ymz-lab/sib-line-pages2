# BaseAI / SIB Company Deck

株式会社BaseAI / Shonan Innovation Base（SIB）の全体概要資料。25ページ、16:9（1920×1080）。

## 構成

```
deck/
├── index.html              全25ページ（1ページ = 1 <section class="slide">）
├── styles.css               共通デザインシステム（色・タイポグラフィ・コンポーネント）
├── screenshots/              QA用ページスクリーンショット（slide_01.png〜slide_25.png）
├── references/                参考デッキのスクリーンショット置き場（本リポジトリには含めていません）
└── BaseAI_SIB_CompanyDeck.pdf 出力PDF（25ページ、1920×1080px＝1440×810pt）
```

## 章構成

1. VISION（表紙〜BaseAIが目指す世界）／2. ECOSYSTEM／3. SIB／
4. BUSINESS COMMUNITY／5. AI×SNS BUSINESS／6. PLATFORM／7. GROWTH／8. VISION（Closing）

## デザインシステム

- カラー: Base Navy `#142B4D` / Base Blue `#4A77C9` / Accent Magenta `#D44AA2` / Light Gray `#F5F7FA`
- フォント: Noto Sans JP（Hiragino Sans / Yu Gothic フォールバック）
- レイアウト・アーキタイプ: 大コピー・ページ／課題対比／コンセプトHub図／サービス定義スプリット／
  プロセス・フロー／ピラー・カードグリッド／写真ページ／プラットフォーム構造／タイムライン
  の9パターンを用途ごとに使い分け、全ページが同じテンプレートにならないようにしている。
- 参考デッキ（LayerX / Gaudiy / SmartHR / YOUTRUST / IVRy / Visional）はレイアウト・余白・情報密度のみを参照し、
  ロゴ・文言・配色・図版は一切流用せず、すべてBaseAIオリジナルとして再構築している。

## QA結果

1. ブラウザ（Chromium / Playwright）で全25ページをレンダリングし、1920×1080のフルページスクリーンショットを取得 → `screenshots/`
2. DOM上で `scrollWidth/Height > clientWidth/Height` を全要素に対して自動検査するオーバーフローチェックを実行
   - 初回検査でp16（リアルコミュニティ・イベント）の画像グリッドが高さ超過（+31px）を検出 → 高さを固定して解消
   - 再検査で全25ページともオーバーフロー0件を確認
3. 目視で主要ページ（表紙・課題・エコシステム図・プラットフォーム図・料金・ロードマップ等）を確認し、
   文字切れ・日本語の不自然な改行・小さすぎる文字・図解の重なりがないことを確認
4. `page.pdf()` にて `BaseAI_SIB_CompanyDeck.pdf` を出力（1920×1080px = 1440×810pt、印刷用背景色を保持）
5. PDFのページ数が25であること、MediaBoxが正しい16:9サイズであることをバイナリ上で確認
6. PDF内のフォントは印刷用CSS（`@media print`）でもブラウザ表示と同一のNoto Sans JPスタックを継承しており、
   崩れは確認されていない

ブラウザレンダリングとPDF出力を正としてQAを実施済み。追加の実写真素材（イベント写真等）を差し込む場合は
p16の画像プレースホルダー（`linear-gradient` のグレー矩形）を実画像に置き換えること。
