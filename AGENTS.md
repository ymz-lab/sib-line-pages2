<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BaseAI Website Rules

## Project
株式会社BaseAIの公式コーポレートサイト。

## Design reference
最重要参考は LayerX：
https://layerx.co.jp/

ただし画像・コード・ロゴ・文章をコピーしない。
参考にするのはデザイン原則のみ。

## Design concept
BASE
CONNECTION
COMMUNITY
PEOPLE
BUSINESS

AIそのものをビジュアルモチーフにしない。

## Visual
- White主体
- Dark Navy
- BaseAI Blue
- 大きな日本語Typography
- 十分な余白
- 細い罫線
- 写真
- Editorial layout
- 12-column Grid

## Never use
- Purple AI gradient
- Glow
- Glassmorphism
- AI network nodes
- Circuit
- Robot
- 3D sphere
- Particle
- Dashboard風UI
- 大量の角丸カード
- 意味のないアイコン

## Japanese typography
日本語の単語・助詞・意味の途中で不自然に改行しない。

例として、
「テクノロジーではな / く」
「関係 / 性」
「伴走 / 役」
のような改行は禁止。

見出しは意味単位で自然に改行する。

文章＋文章の横2カラムは基本使用せず、
文章セクションは縦方向の情報フローを優先する。

## Motion
Framer Motionを使用。
静かで上品なmotionにする。

Text reveal
Image reveal
clip-path
small parallax
stagger

を中心にする。

何でも同じFadeUpにしない。

## Header
TOPではHeader表示。

下方向スクロール時：
Headerを上へ滑らかに隠す。

スクロール後：
右上にTOPへ戻るボタン。

TOPへ戻ったらHeaderを再表示。

## Content
会社情報・実績・提携先・料金を勝手に作らない。

未確定情報は未確定のまま扱う。

会社設立日は確定情報として勝手に記載しない。

「最先端AI企業」などの誇張表現を追加しない。

## Development
既存構造を理解してから変更する。

大規模な全面書き換えより、
既存コードを活かして改善する。

変更後は必ず：

npm run build

を実行。

Desktop / Mobile両方を考慮する。
