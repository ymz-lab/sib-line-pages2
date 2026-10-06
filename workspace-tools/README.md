# 社内ツールポータル（Google Apps Script）

Google Workspaceのログイン情報で利用者を判定し、許可された社内ツールだけを表示するポータルです。Relayのコンタクトと活動履歴は、全利用者で共有するGoogleスプレッドシートへ保存します。

## 初期設定

1. Google Workspaceの管理用アカウントで [Google Apps Script](https://script.google.com/) を開き、スタンドアロンプロジェクトを作成します。
2. このディレクトリの `Code.gs`、`Index.html`、`Styles.html`、`Client.html`、`appsscript.json` をプロジェクトへ登録します。
3. Apps Scriptエディタで `setupInternalTools()` を一度実行し、権限を許可します。
4. 実行結果の `databaseUrl` を開きます。実行したアカウントは管理者として `Users` シートへ登録されています。
5. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選びます。
6. 実行ユーザーを「自分」、アクセスできるユーザーを「組織内の全員」に設定してデプロイします。
7. 発行されたウェブアプリURLを社内メンバーへ共有します。

この方式は、利用者が同じGoogle Workspace組織に所属していることを前提にしています。個人Gmailや組織外アカウントを含める場合は、Firebase Authenticationなど別の認証基盤が必要です。

## 利用者と権限

ポータルの「管理設定」またはデータ用スプレッドシートの `Users` シートで管理します。

| 列 | 内容 |
|---|---|
| Email | Google Workspaceのメールアドレス |
| Name | 表示名 |
| Role | `admin` または `member` |
| Enabled | `TRUE` で利用可能 |
| Tools | `relay` のようなツールID。複数はカンマ区切り、全ツールは `*` |

画面上の表示だけでなく、データの読書きごとにサーバー側で権限を再確認します。利用停止時は `Enabled` を `FALSE` にしてください。

## ツールの追加

`Tools` シートまたは管理画面に、ツールID・名称・説明・URLを登録します。別のApps Scriptウェブアプリなどを `Url` に指定すると、ポータルへカードが追加されます。同一プロジェクト内へ画面を追加する場合は `Route` を使用し、`Code.gs` と `Index.html` にそのルートの実装を追加します。

## Relayの保存先

- `Contacts`: コンタクト、フォロー状態、商談情報
- `Activities`: 操作履歴と実行ユーザー
- `Users`: 利用者と権限
- `Tools`: ポータルに表示するツール

同時更新時はApps Scriptのスクリプトロックを使用します。メールの自動送信機能やAPIキーは含みません。

## 更新時の注意

コードを変更した後は、新しいバージョンとしてウェブアプリを再デプロイします。日常利用者は同じURLを引き続き使用できます。
