# 株式会社BaseAI コーポレートサイト

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion で構築した、
株式会社BaseAIの公式コーポレートサイトです。

（`LP/` `business/` `event/` などのディレクトリは、SIB公式LINEリッチメニュー用の
既存の静的ページで、本サイトとは独立しています。）

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。

## ビルド

```bash
npm run build
npm start
```

## ディレクトリ構成

```
app/            ページ（App Router）
  page.tsx        トップページ
  contact/        お問い合わせページ
  news/           ニュース一覧ページ
  privacy/        プライバシーポリシー
components/     セクション・UIコンポーネント
data/           データ定義（events / news / partners / services）
```

## コンテンツ更新について

- イベント情報: `data/events.ts` に追加してください。未入力の間はTOPに
  「イベント情報は順次公開予定です。」と表示されます。
- ニュース: `data/news.ts` に追加してください。
- 提携先・連携実績: `data/partners.ts` に追加してください。
  `type` は `partner`（正式提携）/ `collaboration`（連携・協力実績）/
  `support`（後援・協賛）を区別できるようになっています。
  未確認の企業を `partner` として登録しないよう注意してください。

## 残タスク（TODO）

- 会社ロゴ・実写真の差し替え（現状は抽象グラフィック / プレースホルダー）
- お問い合わせフォームの送信先エンドポイント実装（`components/ContactForm.tsx` 内 TODO）
- 独自ドメイン確定後、`app/layout.tsx` / `app/sitemap.ts` / `app/robots.ts` の
  `metadataBase` ・サイトURLの更新
- OGP画像の用意
- 会社設立日・登記情報確定後の会社概要ページ更新
