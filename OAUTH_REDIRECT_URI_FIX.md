# GitHub OAuth コールバックURL設定ガイド

## エラー: "The redirect_uri is not associated with this application"

このエラーは、GitHub OAuth AppのコールバックURLと、実際に使用されているコールバックURLが一致していない場合に発生します。

## 解決方法

### ステップ1: RenderのURLを確認

1. Renderのダッシュボードにアクセス: https://render.com
2. デプロイしたWeb Serviceを開く
3. 「Settings」タブを開く
4. 「Service Details」セクションで、Renderが自動生成したURLを確認
   - 例: `https://test-qili.onrender.com`
   - または: `https://portalsite-backend.onrender.com`

### ステップ2: GitHub OAuth Appの設定を更新

1. https://github.com/settings/developers にアクセス
2. 作成したOAuth App（`portalsite`）を開く
3. 「Authorization callback URL」を以下に変更：
   ```
   https://test-qili.onrender.com/api/auth/github/callback
   ```
   **重要**: `test-qili.onrender.com`は実際のRenderのURLに置き換えてください
4. 「Update application」をクリック

### ステップ3: Renderの環境変数を確認・設定

1. Renderのダッシュボードで、Web Serviceを開く
2. 「Environment」タブを開く（または「Settings」→「Environment Variables」）
3. 以下の環境変数が設定されているか確認：

#### 必須の環境変数

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://test-qili.onrender.com/api/auth/github/callback
```

**重要**: `GITHUB_REDIRECT_URI`は、GitHub OAuth Appの「Authorization callback URL」と**完全に一致**している必要があります。

### ステップ4: 設定の確認

以下の2つが**完全に一致**していることを確認してください：

1. **GitHub OAuth Appの「Authorization callback URL」**:
   ```
   https://test-qili.onrender.com/api/auth/github/callback
   ```

2. **Renderの環境変数`GITHUB_REDIRECT_URI`**:
   ```
   https://test-qili.onrender.com/api/auth/github/callback
   ```

### ステップ5: 再デプロイ

1. Renderの環境変数を変更した場合、「Save Changes」をクリック
2. 自動的に再デプロイが開始されます
3. デプロイが完了するまで待ちます（数分）

### ステップ6: 再度認証を試す

1. `https://test9-883.pages.dev` にアクセス
2. 「Blog」タブを開く
3. 「GitHubでログイン」ボタンをクリック
4. GitHubの認証ページで「Authorize」をクリック

## トラブルシューティング

### まだエラーが発生する場合

1. **URLの完全一致を確認**
   - 末尾のスラッシュ（`/`）の有無
   - `http`と`https`の違い
   - 大文字・小文字の違い

2. **Renderのログを確認**
   - Renderのダッシュボードで「Logs」タブを開く
   - エラーメッセージを確認

3. **GitHub OAuth Appの設定を再確認**
   - Client IDとClient Secretが正しいか
   - コールバックURLが正しく設定されているか

## 設定例（完全版）

### GitHub OAuth App設定

- **Application name**: `portalsite`
- **Homepage URL**: `https://test9-883.pages.dev`
- **Authorization callback URL**: `https://test-qili.onrender.com/api/auth/github/callback`

### Render環境変数

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-jwt-secret
GITHUB_CLIENT_ID=Ov23li0hVzMCcMvG5oBv
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URI=https://test-qili.onrender.com/api/auth/github/callback
```

### Cloudflare Pages環境変数

```env
VITE_API_URL=https://test-qili.onrender.com/api
```

## 重要なポイント

- **完全一致**: GitHub OAuth AppのコールバックURLと`GITHUB_REDIRECT_URI`は完全に一致する必要があります
- **バックエンドのURL**: コールバックURLはバックエンド（Render）のURLを指定してください
- **`/api/auth/github/callback`**: パスは`/api/auth/github/callback`である必要があります
