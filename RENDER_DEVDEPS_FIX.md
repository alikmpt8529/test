# Renderビルドエラー解決: devDependencies

## 問題

Renderのビルド時に以下のエラーが発生します：

```
error TS7016: Could not find a declaration file for module 'express'.
error TS2580: Cannot find name 'process'. Do you need to install type definitions for node?
```

## 原因

Renderのビルド時に`NODE_ENV=production`が設定されていると、`npm install`が`devDependencies`をスキップします。しかし、TypeScriptのビルドには`@types/*`パッケージ（`devDependencies`）が必要です。

## 解決方法

### Renderのビルドコマンドを変更

1. Renderのダッシュボードで「Settings」タブを開く
2. 「Build & Deploy」セクションで「Build Command」を以下に変更：
   ```
   npm install --include=dev && npm run build:server
   ```
3. 「Save Changes」をクリック
4. 自動的に再デプロイされます

### 説明

- `npm install --include=dev`: `devDependencies`も含めてインストールします
- これにより、`@types/node`、`@types/express`などの型定義がインストールされます

## 代替案

### 方法1: NODE_ENVを一時的に変更

```
NODE_ENV=development npm install && npm run build:server
```

### 方法2: npm ciを使用

```
npm ci --include=dev && npm run build:server
```

## 推奨設定

**Build Command**:
```
npm install --include=dev && npm run build:server
```

**Start Command**:
```
npm start
```

これで、TypeScriptのビルドに必要な型定義がインストールされ、ビルドエラーが解消されます。
