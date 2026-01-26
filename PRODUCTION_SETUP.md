# 本番環境用セットアップガイド

## 概要

このプロジェクトは、React + TypeScript + Viteのフロントエンドと、Node.js + ExpressのバックエンドAPIで構成されています。

## セキュリティ機能

- **HttpOnly Cookie**: セッショントークンをHttpOnly Cookieで管理（XSS攻撃対策）
- **JWT認証**: セキュアなセッション管理
- **CORS設定**: 適切なCORS設定でクロスオリジンリクエストを制御
- **セキュリティヘッダー**: XSS、クリックジャッキング対策
- **環境変数管理**: 機密情報を環境変数で管理

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

#### 開発環境

`server/.env.development` ファイルを作成:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-development-secret-key-change-in-production
```

#### 本番環境

`server/.env.production` ファイルを作成（または環境変数を直接設定）:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters
```

**重要**: `JWT_SECRET`は本番環境では32文字以上の強力なランダム文字列を使用してください。

### 3. フロントエンドの環境変数

`.env` ファイルを作成（ルートディレクトリ）:

```env
VITE_API_URL=http://localhost:3001/api
```

本番環境では:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### 4. 開発サーバーの起動

#### フロントエンドのみ

```bash
npm run dev
```

#### バックエンドのみ

```bash
npm run dev:server
```

#### 両方同時に起動

```bash
npm run dev:all
```

### 5. 本番ビルド

#### すべてをビルド

```bash
npm run build:all
```

#### フロントエンドのみ

```bash
npm run build
```

#### バックエンドのみ

```bash
npm run build:server
```

### 6. 本番環境での起動

```bash
npm start
```

または、バックエンドのみ:

```bash
npm run start:server
```

## ディレクトリ構造

```
.
├── server/                 # バックエンドAPI
│   ├── index.ts           # メインサーバーファイル
│   ├── routes/           # ルート定義
│   │   ├── auth.ts       # 認証ルート
│   │   └── articles.ts   # 記事ルート
│   ├── services/         # ビジネスロジック
│   │   ├── authService.ts
│   │   ├── githubService.ts
│   │   └── articleService.ts
│   └── data/             # データファイル（自動生成）
├── src/                   # フロントエンド
│   ├── api/              # APIクライアント
│   ├── components/       # Reactコンポーネント
│   ├── contexts/         # React Context
│   └── ...
└── dist/                  # ビルド出力
```

## API エンドポイント

### 認証

- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 認証状態確認
- `POST /api/auth/logout` - ログアウト

### 記事

- `GET /api/articles` - 記事一覧取得（認証不要）
- `POST /api/articles` - 記事投稿（認証必要）

## デプロイ

### 推奨デプロイ方法

1. **フロントエンド**: Vercel、Netlify、Cloudflare Pagesなど
2. **バックエンド**: Railway、Render、Heroku、AWS、GCPなど

### 環境変数の設定

デプロイ先の環境変数設定で以下を設定:

- `NODE_ENV=production`
- `PORT` (デプロイ先が自動設定する場合もあり)
- `FRONTEND_URL` (フロントエンドのURL)
- `JWT_SECRET` (強力なランダム文字列)

## セキュリティチェックリスト

- [ ] `JWT_SECRET`を強力なランダム文字列に変更
- [ ] `.env`ファイルがGitにコミットされていないことを確認
- [ ] HTTPSを使用していることを確認
- [ ] CORS設定が適切であることを確認
- [ ] セキュリティヘッダーが設定されていることを確認
- [ ] エラーメッセージに機密情報が含まれていないことを確認

## トラブルシューティング

### Cookieが送信されない

- `withCredentials: true`が設定されているか確認
- CORS設定で`credentials: true`が設定されているか確認
- フロントエンドとバックエンドのドメインが一致しているか確認（開発環境）

### 認証が失敗する

- バックエンドサーバーが起動しているか確認
- 環境変数が正しく設定されているか確認
- ブラウザの開発者ツールでネットワークリクエストを確認

## ライセンス

MIT
