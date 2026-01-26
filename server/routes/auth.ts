import express from 'express';
import { verifyGitHubToken, getGitHubUser, getGitHubOAuthUrl, exchangeCodeForToken } from '../services/githubService.js';
import { generateSessionToken, verifySessionToken } from '../services/authService.js';

const router = express.Router();
const ALLOWED_USERNAME = 'alikmpt8529';

// GitHub OAuth認証を開始
router.get('/github', (req, res) => {
    try {
        const { url } = getGitHubOAuthUrl();
        res.redirect(url);
    } catch (error: any) {
        console.error('OAuth認証開始エラー:', error);
        res.status(500).json({ error: error.message || 'OAuth認証の開始に失敗しました' });
    }
});

// GitHub OAuthコールバック
router.get('/github/callback', async (req, res) => {
    try {
        const { code, error } = req.query;

        if (error) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=${encodeURIComponent(error as string)}`);
        }

        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=no_code`);
        }

        // codeをaccess_tokenに交換
        const accessToken = await exchangeCodeForToken(code as string);

        // GitHubユーザー情報を取得
        const userData = await getGitHubUser(accessToken);
        
        // 許可されたユーザーのみ
        if (userData.login !== ALLOWED_USERNAME) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=unauthorized&user=${encodeURIComponent(userData.login)}`);
        }

        // セッショントークンを生成
        const sessionToken = generateSessionToken(userData.login);

        // HttpOnly Cookieにセッショントークンを設定
        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000, // 90日
            path: '/',
        });

        // フロントエンドにリダイレクト
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/blog?auth=success`);
    } catch (error) {
        console.error('OAuthコールバックエラー:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=oauth_failed`);
    }
});

// GitHubトークンでログイン（後方互換性のため残す）
router.post('/login', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'トークンが提供されていません' });
        }

        // GitHub APIでトークンを検証
        const isValid = await verifyGitHubToken(token);
        if (!isValid) {
            return res.status(401).json({ error: '無効なトークンです' });
        }

        // GitHubユーザー情報を取得
        const userData = await getGitHubUser(token);
        
        // 許可されたユーザーのみ
        if (userData.login !== ALLOWED_USERNAME) {
            return res.status(403).json({ 
                error: `認証できるのは${ALLOWED_USERNAME}アカウントのみです`,
                currentUser: userData.login
            });
        }

        // セッショントークンを生成
        const sessionToken = generateSessionToken(userData.login);

        // HttpOnly Cookieにセッショントークンを設定
        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 90 * 24 * 60 * 60 * 1000, // 90日
            path: '/',
        });

        res.json({
            success: true,
            user: {
                username: userData.login,
            },
        });
    } catch (error) {
        console.error('ログインエラー:', error);
        res.status(500).json({ error: 'ログインに失敗しました' });
    }
});

// 現在の認証状態を確認
router.get('/me', async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(401).json({ authenticated: false });
        }

        const decoded = verifySessionToken(sessionToken);
        
        if (!decoded || decoded.username !== ALLOWED_USERNAME) {
            res.clearCookie('session_token');
            return res.status(401).json({ authenticated: false });
        }

        res.json({
            authenticated: true,
            user: {
                username: decoded.username,
            },
        });
    } catch (error) {
        console.error('認証確認エラー:', error);
        res.clearCookie('session_token');
        res.status(401).json({ authenticated: false });
    }
});

// ログアウト
router.post('/logout', (req, res) => {
    res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    res.json({ success: true });
});

export { router as authRouter };
