import express from 'express';
import { verifySessionToken } from '../services/authService.js';
import { getArticles, createArticle } from '../services/articleService.js';

const router = express.Router();
const ALLOWED_USERNAME = 'alikmpt8529';

// 認証ミドルウェア
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({ error: '認証が必要です' });
        }

        const decoded = verifySessionToken(sessionToken);
        
        if (!decoded || decoded.username !== ALLOWED_USERNAME) {
            return res.status(403).json({ error: 'アクセス権限がありません' });
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: '認証に失敗しました' });
    }
};

// 記事一覧取得（認証不要）
router.get('/', async (req, res) => {
    try {
        const articles = await getArticles();
        res.json(articles);
    } catch (error) {
        console.error('記事取得エラー:', error);
        res.status(500).json({ error: '記事の取得に失敗しました' });
    }
});

// 記事投稿（認証必要）
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = (req as any).user;

        if (!title || !content) {
            return res.status(400).json({ error: 'タイトルと内容は必須です' });
        }

        const article = await createArticle({
            title: title.trim(),
            content: content.trim(),
            author: user.username,
        });

        res.status(201).json(article);
    } catch (error) {
        console.error('記事投稿エラー:', error);
        res.status(500).json({ error: '記事の投稿に失敗しました' });
    }
});

export { router as articlesRouter };
