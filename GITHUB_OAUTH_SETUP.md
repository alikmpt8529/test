# GitHub OAuth認証セットアップガイド

## GitHub OAuth Appの作成方法

1. **GitHubにログイン**
   - https://github.com/settings/developers にアクセス

2. **OAuth Appを作成**
   - 「OAuth Apps」セクションで「New OAuth App」をクリック
   - または直接 https://github.com/settings/developers から「New OAuth App」をクリック

3. **アプリケーション情報を入力**
   - **Application name**: アプリケーション名（例: "My Blog App"）
   - **Homepage URL**: フロントエンドのURL
     - 開発環境: `http://localhost:5173`
     - 本番環境: `https://your-domain.com`
   - **Authorization callback URL**: コールバックURL
     - 開発環境: `http://localhost:5173/auth/callback`
     - 本番環境: `https://your-domain.com/auth/callback`
     - **重要**: このURLはバックエンドのコールバックエンドポイントではなく、フロントエンドのURLです

4. **アプリケーションを登録**
   - 「Register application」をクリック

5. **Client IDとClient Secretを取得**
   - 作成後、**Client ID**が表示されます
   - **Generate a new client secret**をクリックして**Client Secret**を生成
   - **重要**: Client Secretは一度しか表示されないため、必ずコピーして保存してください

## 環境変数の設定

### 開発環境 (`server/.env.development`)

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-development-secret-key-change-in-production
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 本番環境 (`server/.env.production`)

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
GITHUB_REDIRECT_URI=https://your-domain.com/auth/callback
```

## 認証フロー

1. ユーザーが「GitHubでログイン」ボタンをクリック
2. GitHubの認証ページにリダイレクト
3. ユーザーがGitHubで認証を承認
4. GitHubがコールバックURLにcodeを返す
5. バックエンドがcodeをaccess_tokenに交換
6. access_tokenでユーザー情報を取得
7. 許可されたユーザー（alikmpt8529）のみ認証成功
8. セッショントークンをHttpOnly Cookieに保存
9. フロントエンドにリダイレクト

## セキュリティ

- **HttpOnly Cookie**: セッショントークンはHttpOnly Cookieで管理（XSS攻撃対策）
- **CSRF対策**: stateパラメータを使用（実装予定）
- **ユーザー制限**: alikmpt8529アカウントのみ認証可能
- **セキュアなトークン交換**: バックエンドでのみaccess_tokenを取得

## トラブルシューティング

### OAuth認証が失敗する場合

1. **GitHub OAuth Appの設定を確認**
   - Authorization callback URLが正しいか確認
   - Client IDとClient Secretが正しく設定されているか確認

2. **環境変数を確認**
   - `GITHUB_CLIENT_ID`と`GITHUB_CLIENT_SECRET`が設定されているか確認
   - `GITHUB_REDIRECT_URI`がGitHub OAuth Appの設定と一致しているか確認

3. **バックエンドサーバーが起動しているか確認**
   ```bash
   npm run dev:server
   ```

4. **ブラウザのコンソールでエラーを確認**
   - F12キーで開発者ツールを開く
   - ConsoleタブとNetworkタブでエラーを確認

### コールバックURLのエラー

- コールバックURLはフロントエンドのURLを指定してください
- バックエンドのURL（例: `http://localhost:3001/api/auth/github/callback`）ではありません
- フロントエンドのURL（例: `http://localhost:5173/auth/callback`）を指定してください

## 注意事項

- Client Secretは機密情報です。絶対にGitにコミットしないでください
- 本番環境では、環境変数を直接設定することを推奨します
- OAuth Appの設定は、開発環境と本番環境で別々に作成することを推奨します
