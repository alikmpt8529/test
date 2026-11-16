# Firebase Spark（Hosting）セットアップ

この構成では、Reactの画面をFirebase Hostingに配置し、Express APIは現在のバックエンドサービスで動かします。Firebase FunctionsやFirebase SDKは使わないため、Sparkプランのまま始められます。

## 進捗

リポジトリ側の準備は完了しています。

- [x] `firebase.json` / `.firebaserc`（デフォルト: `alikhome`）
- [x] `npm run deploy:firebase`
- [ ] `firebase login`（初回のみ）
- [ ] `VITE_API_URL` を指定してデプロイ
- [x] `FRONTEND_URL` を `https://alikhome.web.app` に更新（`render.yaml`）

## 1. Firebaseプロジェクトを作成

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成します（既存の`alikhome`を使う場合はスキップ）。
2. Google Analyticsは任意です。
3. プロジェクトの料金プランがSparkであることを確認します。利用上限を超えると、そのFirebase製品は当月の残り期間停止されます。
4. Firebase Hostingを開き、ウェブアプリのデプロイを開始します。

## 2. Firebase CLIでログイン

```bash
npm install -g firebase-tools
firebase login
```

このリポジトリは既定のデプロイ先を`alikhome`に設定しています。別のFirebaseプロジェクトへ切り替える場合だけ、`firebase use --add`を実行してください。

## 3. 本番用API URLを設定してビルド

Firebase Hostingは静的ファイルを配信するため、Express APIのURLをビルド時に指定します。

```bash
VITE_API_URL=https://<バックエンドのホスト名>/api npm run build
```

例:

```bash
VITE_API_URL=https://example-api.onrender.com/api npm run build
```

`VITE_API_URL`はブラウザに公開される値です。GitHub Client SecretやJWT Secretなどの秘密情報は設定しないでください。

## 4. OAuthとバックエンドを更新

Firebase Hostingへ最初にデプロイすると、`https://<project-id>.web.app`形式のURLが発行されます。そのURLを使って、バックエンドの環境変数を更新します。

- `FRONTEND_URL=https://alikhome.web.app`（バックエンドのCORS許可オリジン）
- GitHub OAuth AppのAuthorization callback URL: `https://<バックエンドのホスト名>/api/auth/github/callback`
- バックエンドの`GITHUB_REDIRECT_URI`: 同じバックエンドコールバックURL

このプロジェクトのOAuthコールバックはExpress側で処理するため、GitHub OAuth Appのcallback URLはFirebase HostingのURLではなくバックエンドURLです。

**重要**: `render.yaml` を更新しても、Renderダッシュボードの Environment に既存値がある場合は上書きされないことがあります。Render の Web Service → Environment で `FRONTEND_URL=https://alikhome.web.app` を手動設定し、再デプロイしてください。

## 5. デプロイ

```bash
VITE_API_URL=https://<バックエンドのホスト名>/api npm run deploy:firebase
```

このコマンドは本番ビルドの後、`alikhome`のFirebase Hostingへデプロイします。Firebase CLIのログインがまだの場合は、先に`firebase login`を実行してください。

`firebase.json`は`dist`をHostingへ公開し、SPA内のパスを`index.html`にフォールバックします。

## メモ

- デプロイ前に、バックエンドがFirebase HostingのドメインからのCookie付きリクエストを受け入れることを確認してください。このアプリは認証セッションと訪問者識別にCookieを使います。
- 独自ドメインを設定した場合は、バックエンドの`FRONTEND_URL`にもそのドメインを指定します。
- Sparkプランでは各サービスの無料枠を超過すると、そのサービスが当月末まで停止される場合があります。利用上限は[Firebaseの料金プラン](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)と[Hostingの利用上限](https://firebase.google.com/docs/hosting/usage-quotas-pricing)で確認してください。
