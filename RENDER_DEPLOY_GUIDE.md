# Renderデプロイ完全ガイド

## 概要

このガイドでは、Render（https://render.com）を使用してバックエンドをデプロイする手順を説明します。

---

## ステップ1: Renderアカウントの作成

1. https://render.com にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでログイン（推奨）
   - これにより、GitHubリポジトリから自動デプロイが可能になります

---

## ステップ2: 新しいWeb Serviceを作成

1. Renderのダッシュボードで「New +」をクリック
2. 「Web Service」を選択
3. GitHubリポジトリを接続
   - このプロジェクトのリポジトリを選択
   - 初回は「Connect GitHub」をクリックして認証が必要な場合があります

---

## ステップ3: Web Serviceの設定

以下の設定を行います：

### 基本設定

- **Name**: 任意の名前（例: `portalsite-backend`）
- **Environment**: `Node`
- **Region**: 最寄りのリージョンを選択（例: `Singapore`）
- **Branch**: `main`（または使用しているブランチ名）

### Build & Deploy設定

- **Root Directory**: `.`（ルートディレクトリ）
- **Build Command**: 
  ```
  npm install && npm run build:server
  ```
- **Start Command**: 
  ```
  npm start
  ```

### 環境変数の設定

「Environment」セクションで以下の環境変数を追加します：

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://test9-883.pages.dev
JWT_SECRET=your-strong-random-secret-key-minimum-32-characters-change-this
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-app-name.onrender.com/api/auth/github/callback
```

**重要**: 
- `JWT_SECRET`は32文字以上の強力なランダム文字列に変更してください
- `GITHUB_REDIRECT_URI`は、後で取得するRenderのURLを使用します（今は仮の値でOK）

### その他の設定

- **Auto-Deploy**: `Yes`（推奨）
  - GitHubにプッシュするたびに自動デプロイされます

---

## ステップ4: デプロイの開始

1. 「Create Web Service」をクリック
2. Renderが自動的にビルドとデプロイを開始します
3. 数分待ちます（初回は5-10分かかる場合があります）

---

## ステップ5: RenderのURLを取得

1. デプロイが完了したら、Renderのダッシュボードで「Settings」タブを開く
2. 「Service Details」セクションで、Renderが自動生成したURLを確認
   - 例: `https://portalsite-backend.onrender.com`
3. このURLが**バックエンドのURL**です

---

## ステップ6: 環境変数の更新

### Renderの環境変数を更新

1. Renderのダッシュボードで「Environment」タブを開く
2. `GITHUB_REDIRECT_URI`を実際のRenderのURLに更新：
   ```env
   GITHUB_REDIRECT_URI=https://portalsite-backend.onrender.com/api/auth/github/callback
   ```
   （`portalsite-backend.onrender.com`は実際のRenderのURLに置き換え）
3. 「Save Changes」をクリック
4. Renderが自動的に再デプロイを開始します

---

## ステップ7: GitHub OAuth Appの設定を更新

1. https://github.com/settings/developers にアクセス
2. 作成したOAuth App（`portalsite`）を開く
3. 「Authorization callback URL」を以下に変更：
   ```
   https://portalsite-backend.onrender.com/api/auth/github/callback
   ```
   （`portalsite-backend.onrender.com`は実際のRenderのURLに置き換え）
4. 「Update application」をクリック

---

## ステップ8: Cloudflare Pagesの環境変数設定

Cloudflare Pagesのダッシュボードで：

1. 「Settings」→「Environment variables」を開く
2. 以下を追加：
   ```env
   VITE_API_URL=https://portalsite-backend.onrender.com/api
   ```
   （`portalsite-backend.onrender.com`は実際のRenderのURLに置き換え）
3. 「Save」をクリック
4. Cloudflare Pagesを再デプロイ（自動的に再デプロイされる場合もあります）

---

## ステップ9: 動作確認

### 1. バックエンドのヘルスチェック

ブラウザで以下にアクセス：
```
https://portalsite-backend.onrender.com/api/health
```

レスポンス例：
```json
{"status":"ok","timestamp":"2026-01-27T12:00:00.000Z"}
```

### 2. OAuth認証のテスト

1. Cloudflare Pagesのサイト（`https://test9-883.pages.dev`）にアクセス
2. 「Blog」タブを開く
3. 「GitHubでログイン」をクリック
4. GitHubの認証ページにリダイレクトされることを確認
5. 認証後、正常にリダイレクトされることを確認

---

## 設定の確認チェックリスト

- [ ] RenderのWeb Serviceが作成され、デプロイが完了している
- [ ] RenderのURLを取得している（例: `https://portalsite-backend.onrender.com`）
- [ ] Renderの環境変数が正しく設定されている
  - [ ] `GITHUB_REDIRECT_URI`がRenderのURLになっている
  - [ ] `FRONTEND_URL`が`https://test9-883.pages.dev`になっている
  - [ ] `JWT_SECRET`が強力なランダム文字列になっている
- [ ] GitHub OAuth AppのコールバックURLがRenderのURLになっている
- [ ] Cloudflare Pagesの`VITE_API_URL`がRenderのURLになっている
- [ ] バックエンドのヘルスチェックが成功している

---

## トラブルシューティング

### ビルドエラーが発生する

1. Renderのログを確認：
   - Renderのダッシュボードで「Logs」タブを開く
   - エラーメッセージを確認

2. よくある問題：
   - **TypeScriptエラー**: `npm run build:server`でローカルで確認
   - **依存関係エラー**: `package.json`の依存関係を確認
   - **環境変数エラー**: 環境変数が正しく設定されているか確認

### デプロイは成功したが、APIが動作しない

1. **ヘルスチェックエンドポイントを確認**:
   ```
   https://your-app.onrender.com/api/health
   ```

2. **Renderのログを確認**:
   - 「Logs」タブでエラーメッセージを確認

3. **環境変数を確認**:
   - すべての環境変数が正しく設定されているか確認
   - 特に`NODE_ENV=production`が設定されているか確認

### OAuth認証が失敗する

1. **GitHub OAuth Appの設定を確認**:
   - コールバックURLがRenderのURLになっているか確認
   - Client IDとClient Secretが正しいか確認

2. **Renderの環境変数を確認**:
   - `GITHUB_REDIRECT_URI`がGitHub OAuth Appの設定と一致しているか確認
   - `GITHUB_CLIENT_ID`と`GITHUB_CLIENT_SECRET`が正しいか確認

3. **Renderのログを確認**:
   - OAuth認証時のエラーメッセージを確認

### CORSエラーが発生する

1. **バックエンドのCORS設定を確認**:
   - `server/index.ts`で`FRONTEND_URL`が正しく設定されているか確認

2. **Cloudflare Pagesの環境変数を確認**:
   - `VITE_API_URL`が正しく設定されているか確認

### Renderがスリープする（無料プラン）

Renderの無料プランでは、15分間アクセスがないとスリープします。

**解決方法**:
1. **有料プランにアップグレード**（推奨）
2. **外部のpingサービスを使用**:
   - UptimeRobot（https://uptimerobot.com）などのサービスを使用
   - 定期的に`/api/health`エンドポイントにアクセスするように設定

---

## Renderの無料プランの制限

- **スリープ**: 15分間アクセスがないとスリープします
- **起動時間**: スリープからの復帰に30秒〜2分かかります
- **帯域幅**: 月100GBまで

本番環境では、有料プラン（$7/月）の使用を推奨します。

---

## 次のステップ

1. デプロイが完了したら、GitHub OAuth Appの設定を更新
2. Cloudflare Pagesの環境変数を設定
3. 動作確認
4. 必要に応じて、カスタムドメインを設定（Renderの有料プラン）

---

## まとめ

1. ✅ RenderでWeb Serviceを作成
2. ✅ 環境変数を設定
3. ✅ デプロイを開始
4. ✅ RenderのURLを取得
5. ✅ GitHub OAuth Appの設定を更新
6. ✅ Cloudflare Pagesの環境変数を設定
7. ✅ 動作確認

これで、Renderでのバックエンドデプロイが完了です！
