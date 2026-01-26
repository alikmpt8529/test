# Cloudflare Pages デプロイ設定ガイド

## ドメイン: https://test9-883.pages.dev/

## デプロイ構成

Cloudflare Pagesを使用している場合、以下の2つの方法があります：

### 方法1: フロントエンドとバックエンドを分離（推奨）

- **フロントエンド**: Cloudflare Pages (`https://test9-883.pages.dev/`)
- **バックエンド**: Railway、Render、Heroku、AWS、GCPなど（別のURL）

### 方法2: バックエンドサーバーでフロントエンドも配信

- **バックエンドサーバー**: Railway、Render、Herokuなど
- **フロントエンド**: バックエンドサーバーから配信

---

## 方法1: 分離デプロイ（推奨）

### ステップ1: GitHub OAuth Appの設定

1. https://github.com/settings/developers にアクセス
2. 「OAuth Apps」→「New OAuth App」をクリック
3. 以下を設定：

   - **Application name**: `My Blog App`（任意の名前）
   - **Homepage URL**: `https://test9-883.pages.dev`
   - **Authorization callback URL**: `https://test9-883.pages.dev/auth/callback`

4. 「Register application」をクリック
5. **Client ID**と**Client Secret**をコピー

### ステップ2: バックエンドの環境変数設定

バックエンドサーバー（Railway、Renderなど）の環境変数に以下を設定：

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://test9-883.pages.dev/auth/callback
```

### ステップ3: フロントエンドの環境変数設定

Cloudflare Pagesの環境変数に以下を設定：

```env
VITE_API_URL=https://your-backend-domain.com/api
```

**重要**: `your-backend-domain.com`は実際のバックエンドサーバーのURLに置き換えてください。

### ステップ4: CORS設定の確認

バックエンドサーバーのCORS設定で、`https://test9-883.pages.dev`を許可する必要があります。

---

## 方法2: バックエンドサーバーでフロントエンドも配信

### ステップ1: GitHub OAuth Appの設定

1. https://github.com/settings/developers にアクセス
2. 「OAuth Apps」→「New OAuth App」をクリック
3. 以下を設定：

   - **Application name**: `My Blog App`
   - **Homepage URL**: `https://your-backend-domain.com`（バックエンドサーバーのURL）
   - **Authorization callback URL**: `https://your-backend-domain.com/auth/callback`

4. 「Register application」をクリック
5. **Client ID**と**Client Secret**をコピー

### ステップ2: バックエンドの環境変数設定

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-backend-domain.com
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-backend-domain.com/auth/callback
```

### ステップ3: Cloudflare Pagesの設定

Cloudflare Pagesでカスタムドメインを設定し、バックエンドサーバーにプロキシするか、またはCloudflare Pagesのビルドを無効にして、バックエンドサーバーから直接配信します。

---

## 推奨設定（方法1を使用する場合）

### GitHub OAuth App設定

- **Homepage URL**: `https://test9-883.pages.dev`
- **Authorization callback URL**: `https://test9-883.pages.dev/auth/callback`

### バックエンド環境変数

```env
NODE_ENV=production
FRONTEND_URL=https://test9-883.pages.dev
GITHUB_REDIRECT_URI=https://test9-883.pages.dev/auth/callback
```

### フロントエンド環境変数（Cloudflare Pages）

```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## 注意事項

1. **HTTPS必須**: Cloudflare PagesはHTTPSを使用するため、バックエンドサーバーもHTTPSが必要です
2. **Cookie設定**: `secure: true`が設定されているため、HTTPS接続が必要です
3. **CORS設定**: バックエンドで`https://test9-883.pages.dev`を許可する必要があります
4. **環境変数**: Cloudflare Pagesの環境変数は「Settings」→「Environment variables」で設定できます
