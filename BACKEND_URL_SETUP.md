# バックエンドURLの取得と設定方法

## 概要

`https://your-backend-domain.com/api/auth/github/callback` の `your-backend-domain.com` は、**バックエンドサーバーをデプロイした後に取得できるURL**です。

Cloudflare Pagesは静的サイトホスティングのため、バックエンドAPIは別のサービスにデプロイする必要があります。

---

## ステップ1: バックエンドデプロイサービスの選択

以下のいずれかのサービスを使用できます：

### 推奨サービス

1. **Railway** (https://railway.app)
   - 無料プランあり
   - GitHub連携が簡単
   - 自動デプロイ対応

2. **Render** (https://render.com)
   - 無料プランあり
   - GitHub連携が簡単
   - 自動デプロイ対応

3. **Heroku** (https://heroku.com)
   - 有料プランのみ（無料プラン終了）
   - 安定性が高い

4. **Fly.io** (https://fly.io)
   - 無料プランあり
   - 高速

---

## ステップ2: Railwayでデプロイする場合（推奨）

### 1. Railwayアカウント作成

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでログイン

### 2. プロジェクトをデプロイ

1. 「New Project」→「Deploy from GitHub repo」を選択
2. このリポジトリを選択
3. Railwayが自動的にNode.jsプロジェクトを検出

### 3. 環境変数の設定

Railwayのダッシュボードで「Variables」タブを開き、以下を設定：

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-app.railway.app/api/auth/github/callback
```

**重要**: `GITHUB_REDIRECT_URI`は、Railwayが提供するURLを使用します（後で確認します）。

### 4. バックエンドURLの取得

1. Railwayのダッシュボードで「Settings」タブを開く
2. 「Domains」セクションで、Railwayが自動生成したURLを確認
   - 例: `https://your-app-name.up.railway.app`
3. このURLが**バックエンドのURL**です

### 5. GitHub OAuth Appの設定を更新

1. https://github.com/settings/developers にアクセス
2. 作成したOAuth App（`portalsite`）を開く
3. 「Authorization callback URL」を以下に変更：
   ```
   https://your-app-name.up.railway.app/api/auth/github/callback
   ```
   （`your-app-name.up.railway.app`は実際のRailwayのURLに置き換え）
4. 「Update application」をクリック

### 6. 環境変数を再設定

Railwayの環境変数で`GITHUB_REDIRECT_URI`を更新：

```env
GITHUB_REDIRECT_URI=https://your-app-name.up.railway.app/api/auth/github/callback
```

---

## ステップ3: Renderでデプロイする場合

### 1. Renderアカウント作成

1. https://render.com にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでログイン

### 2. プロジェクトをデプロイ

1. 「New +」→「Web Service」を選択
2. GitHubリポジトリを選択
3. 以下を設定：
   - **Name**: 任意の名前
   - **Environment**: `Node`
   - **Build Command**: `npm run build:all`
   - **Start Command**: `npm start`
   - **Root Directory**: `.`（ルートディレクトリ）

### 3. 環境変数の設定

Renderのダッシュボードで「Environment」セクションに以下を追加：

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-app.onrender.com/api/auth/github/callback
```

### 4. バックエンドURLの取得

1. Renderのダッシュボードで「Settings」タブを開く
2. 「Service Details」セクションで、Renderが自動生成したURLを確認
   - 例: `https://your-app-name.onrender.com`
3. このURLが**バックエンドのURL**です

### 5. GitHub OAuth Appの設定を更新

1. https://github.com/settings/developers にアクセス
2. 作成したOAuth App（`portalsite`）を開く
3. 「Authorization callback URL」を以下に変更：
   ```
   https://your-app-name.onrender.com/api/auth/github/callback
   ```
4. 「Update application」をクリック

---

## ステップ4: Cloudflare Pagesの環境変数設定

Cloudflare Pagesのダッシュボードで：

1. 「Settings」→「Environment variables」を開く
2. 以下を追加：

```env
VITE_API_URL=https://your-backend-domain.com/api
```

**例**:
- Railway: `VITE_API_URL=https://your-app-name.up.railway.app/api`
- Render: `VITE_API_URL=https://your-app-name.onrender.com/api`

---

## 設定の確認

### 1. GitHub OAuth App設定

- **Homepage URL**: `https://test9-883.pages.dev`
- **Authorization callback URL**: `https://your-backend-domain.com/api/auth/github/callback`

### 2. バックエンド環境変数

```env
NODE_ENV=production
FRONTEND_URL=https://test9-883.pages.dev
GITHUB_REDIRECT_URI=https://your-backend-domain.com/api/auth/github/callback
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret
```

### 3. Cloudflare Pages環境変数

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 動作確認

1. バックエンドが起動しているか確認：
   ```
   https://your-backend-domain.com/api/health
   ```
   レスポンス: `{"status":"ok","timestamp":"..."}`

2. フロントエンドからバックエンドに接続できるか確認：
   - Cloudflare Pagesのサイトにアクセス
   - ブラウザの開発者ツール（F12）→「Network」タブ
   - 「GitHubでログイン」をクリック
   - `/api/auth/github`へのリクエストが成功するか確認

---

## トラブルシューティング

### バックエンドURLが取得できない

- Railway/Renderのダッシュボードで「Settings」→「Domains」を確認
- デプロイが完了しているか確認（数分かかる場合があります）

### OAuth認証が失敗する

1. GitHub OAuth AppのコールバックURLが正しいか確認
2. バックエンドの`GITHUB_REDIRECT_URI`がGitHub OAuth Appの設定と一致しているか確認
3. バックエンドのログを確認（Railway/Renderのダッシュボードで確認可能）

### CORSエラーが発生する

バックエンドの`server/index.ts`で、`FRONTEND_URL`が正しく設定されているか確認してください。

---

## まとめ

1. **バックエンドをデプロイ**（Railway、Renderなど）
2. **デプロイ後に取得したURL**をGitHub OAuth AppのコールバックURLに設定
3. **バックエンドの環境変数**に同じURLを設定
4. **Cloudflare Pagesの環境変数**にバックエンドのAPI URLを設定

これで、`https://your-backend-domain.com/api/auth/github/callback` の設定が完了します！
