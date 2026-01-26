# Cloudflare Pages + バックエンド分離時のOAuth設定

## 現在の設定の問題点

GitHub OAuth Appの設定で：
- **Authorization callback URL**: `https://test9-883.pages.dev/auth/callback`

しかし、実際のコールバック処理はバックエンドサーバー（例: Railway、Render）の `/api/auth/github/callback` で行われます。

Cloudflare Pagesは静的サイトホスティングのため、バックエンドのエンドポイントを直接処理できません。

## 解決方法

### 方法1: コールバックURLをバックエンドのURLに変更（推奨）

#### GitHub OAuth Appの設定を変更

1. https://github.com/settings/developers にアクセス
2. 作成したOAuth Appを開く
3. 「Authorization callback URL」を以下に変更：
   ```
   https://your-backend-domain.com/api/auth/github/callback
   ```
   **例**:
   - Railway: `https://your-app.railway.app/api/auth/github/callback`
   - Render: `https://your-app.onrender.com/api/auth/github/callback`
   - Heroku: `https://your-app.herokuapp.com/api/auth/github/callback`

4. 「Update application」をクリック

#### バックエンドの環境変数設定

```env
NODE_ENV=production
FRONTEND_URL=https://test9-883.pages.dev
GITHUB_REDIRECT_URI=https://your-backend-domain.com/api/auth/github/callback
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret
```

**重要**: `GITHUB_REDIRECT_URI`はバックエンドのURLを指定してください。

---

### 方法2: Cloudflare Pagesでリダイレクトを設定

Cloudflare Pagesの`_redirects`ファイルを使用して、`/auth/callback`をバックエンドにプロキシします。

#### `public/_redirects`ファイルを作成

```
/auth/callback  https://your-backend-domain.com/api/auth/github/callback  301
```

ただし、この方法ではCookieが正しく設定されない可能性があるため、**方法1を推奨**します。

---

## 推奨設定（方法1を使用）

### GitHub OAuth App設定

- **Application name**: `portalsite`
- **Homepage URL**: `https://test9-883.pages.dev`
- **Authorization callback URL**: `https://your-backend-domain.com/api/auth/github/callback` ← **バックエンドのURL**

### バックエンド環境変数

```env
NODE_ENV=production
FRONTEND_URL=https://test9-883.pages.dev
GITHUB_REDIRECT_URI=https://your-backend-domain.com/api/auth/github/callback
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret
```

### Cloudflare Pages環境変数

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 認証フロー（修正後）

1. ユーザーが「GitHubでログイン」をクリック
2. フロントエンド → バックエンド `/api/auth/github` にリクエスト
3. バックエンド → GitHub認証ページにリダイレクト
4. ユーザーがGitHubで認証を承認
5. GitHub → バックエンド `/api/auth/github/callback` にリダイレクト（code付き）
6. バックエンドがcodeをaccess_tokenに交換
7. バックエンドがセッションCookieを設定
8. バックエンド → フロントエンド `https://test9-883.pages.dev/blog?auth=success` にリダイレクト

---

## 確認事項

- [ ] GitHub OAuth AppのコールバックURLがバックエンドのURLになっている
- [ ] バックエンドの`GITHUB_REDIRECT_URI`がGitHub OAuth Appの設定と一致している
- [ ] バックエンドの`FRONTEND_URL`が`https://test9-883.pages.dev`になっている
- [ ] Cloudflare Pagesの`VITE_API_URL`がバックエンドのURLになっている
