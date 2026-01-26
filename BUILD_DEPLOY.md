# ビルドとデプロイガイド

## ビルド手順

### 1. すべてをビルド

```bash
npm run build:all
```

これにより以下が実行されます：
- フロントエンドのビルド（`dist/`フォルダに出力）
- バックエンドのビルド（`dist/server/`フォルダに出力）

### 2. 本番環境での起動

```bash
npm start
```

または

```bash
NODE_ENV=production node dist/server/index.js
```

## 本番環境の設定

### 環境変数の設定

`server/.env.production` ファイルを作成、または環境変数を直接設定：

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-client-secret
GITHUB_REDIRECT_URI=https://your-domain.com/auth/callback
```

### 重要な設定

- **FRONTEND_URL**: 実際のフロントエンドのURL（HTTPS推奨）
- **GITHUB_REDIRECT_URI**: フロントエンドのURL + `/auth/callback`
- **JWT_SECRET**: 32文字以上の強力なランダム文字列

## 動作確認

### ビルド後の動作確認

1. **ビルドを実行**
   ```bash
   npm run build:all
   ```

2. **本番モードで起動**
   ```bash
   npm start
   ```

3. **ブラウザで確認**
   - http://localhost:3001 にアクセス
   - すべての機能が動作することを確認

## デプロイ方法

### 方法1: 単一サーバーでデプロイ（推奨）

バックエンドサーバーがフロントエンドの静的ファイルも配信します。

1. **ビルド**
   ```bash
   npm run build:all
   ```

2. **サーバーを起動**
   ```bash
   npm start
   ```

3. **リバースプロキシの設定（Nginx例）**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### 方法2: 分離デプロイ

フロントエンドとバックエンドを別々にデプロイ。

1. **フロントエンド**: Vercel、Netlify、Cloudflare Pagesなど
2. **バックエンド**: Railway、Render、Heroku、AWS、GCPなど

この場合、CORS設定と環境変数を適切に設定してください。

## トラブルシューティング

### ビルドエラー

- TypeScriptのエラーを確認: `npm run build:server`
- 依存関係を確認: `npm install`

### 本番環境で静的ファイルが表示されない

- `dist/`フォルダが存在するか確認
- サーバーのログで静的ファイルのパスを確認
- ファイルのパーミッションを確認

### APIが動作しない

- 環境変数が正しく設定されているか確認
- バックエンドサーバーが起動しているか確認
- CORS設定を確認

## セキュリティチェックリスト

- [ ] `JWT_SECRET`が強力なランダム文字列に設定されている
- [ ] `.env`ファイルがGitにコミットされていない
- [ ] HTTPSが使用されている（本番環境）
- [ ] セキュリティヘッダーが設定されている
- [ ] CORS設定が適切である
