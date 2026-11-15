import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { articlesRouter } from './routes/articles.js';
import { visitorsRouter } from './routes/visitors.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数の読み込み
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

// ミドルウェア設定
app.use(cors({
    origin: isProduction ? FRONTEND_URL : FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// セキュリティヘッダー
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (isProduction) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// APIルート
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/visitors', visitorsRouter);

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 本番環境: 静的ファイルの配信（SERVE_STATIC_FILESがtrueの場合のみ）
// フロントエンドとバックエンドを分離してデプロイする場合は、この機能を無効にする
if (isProduction && process.env.SERVE_STATIC_FILES === 'true') {
    const distPath = path.join(__dirname, '..', '..', 'dist');
    
    // 静的ファイル（JS、CSS、画像など）を配信
    app.use(express.static(distPath, {
        maxAge: '1y',
        etag: true,
    }));

    // SPAのルーティング: すべてのルートをindex.htmlにフォールバック
    app.get('*', (req, res) => {
        // APIルートは除外
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// エラーハンドリング（Render の Logs で原因を特定しやすくする）
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (res.headersSent) return;
    const path = `${req.method} ${req.originalUrl || req.url}`;
    console.error(`[500] ${path}`, err.message);
    console.error(err.stack);
    res.status(500).json({
        error: 'サーバーエラーが発生しました',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
    console.log(`📝 環境: ${process.env.NODE_ENV || 'development'}`);
    if (isProduction && process.env.SERVE_STATIC_FILES === 'true') {
        console.log(`📦 静的ファイルを配信中: ${path.join(__dirname, '..', '..', 'dist')}`);
    } else if (isProduction) {
        console.log(`📦 静的ファイルの配信は無効です（分離デプロイモード）`);
    }
});

export default app;
