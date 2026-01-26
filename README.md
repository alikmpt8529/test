# React + TypeScript + Vite + Express

このプロジェクトは、React + TypeScript + Viteのフロントエンドと、Node.js + ExpressのバックエンドAPIで構成されています。

## 機能

- GitHub OAuth認証（トークン入力不要）
- 記事投稿機能（認証ユーザーのみ）
- 記事一覧表示
- レスポンシブデザイン

## クイックスタート

### 開発環境

```bash
# 依存関係のインストール
npm install

# 環境変数の設定（server/.env.developmentを作成）
# 詳細は GITHUB_OAUTH_SETUP.md を参照

# 開発サーバーを起動（フロントエンド + バックエンド）
npm run dev:all
```

### 本番ビルド

```bash
# すべてをビルド
npm run build:all

# 本番環境で起動
npm start
```

詳細は `BUILD_DEPLOY.md` を参照してください。

## セットアップ

### 1. GitHub OAuth Appの作成

1. https://github.com/settings/developers にアクセス
2. 「OAuth Apps」→「New OAuth App」をクリック
3. 以下を設定:
   - **Application name**: アプリ名
   - **Homepage URL**: `http://localhost:5173`（開発環境）
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`（開発環境）

詳細は `GITHUB_OAUTH_SETUP.md` を参照してください。

### 2. 環境変数の設定

`server/.env.development` を作成:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-development-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/callback
```

## スクリプト

- `npm run dev` - フロントエンドのみ起動
- `npm run dev:server` - バックエンドのみ起動
- `npm run dev:all` - フロントエンド + バックエンドを同時起動
- `npm run build` - フロントエンドをビルド
- `npm run build:server` - バックエンドをビルド
- `npm run build:all` - すべてをビルド
- `npm start` - 本番環境で起動（ビルド後）

## ビルド後の動作

ビルド後は、バックエンドサーバーがフロントエンドの静的ファイルも配信します。

1. **ビルド**
   ```bash
   npm run build:all
   ```

2. **起動**
   ```bash
   npm start
   ```

3. **アクセス**
   - http://localhost:3001 にアクセス
   - すべての機能が動作します

## ドキュメント

- `PRODUCTION_SETUP.md` - 本番環境セットアップガイド
- `GITHUB_OAUTH_SETUP.md` - GitHub OAuth認証セットアップガイド
- `BUILD_DEPLOY.md` - ビルドとデプロイガイド

## ライセンス

MIT
