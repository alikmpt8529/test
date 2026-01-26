const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_OAUTH_BASE = 'https://github.com/login/oauth';

interface GitHubOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

// GitHub OAuth設定を取得
export const getGitHubOAuthConfig = (): GitHubOAuthConfig => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback`;

    if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth設定が不完全です。GITHUB_CLIENT_IDとGITHUB_CLIENT_SECRETを設定してください。');
    }

    return { clientId, clientSecret, redirectUri };
};

// OAuth認証URLを生成（stateも返す）
export const getGitHubOAuthUrl = (): { url: string; state: string } => {
    const config = getGitHubOAuthConfig();
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // CSRF対策用のランダム文字列
    
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: 'read:user',
        state: state,
    });

    return {
        url: `${GITHUB_OAUTH_BASE}/authorize?${params.toString()}`,
        state: state
    };
};

// OAuth codeをaccess_tokenに交換
export const exchangeCodeForToken = async (code: string): Promise<string> => {
    const config = getGitHubOAuthConfig();

    const response = await fetch(`${GITHUB_OAUTH_BASE}/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code: code,
            redirect_uri: config.redirectUri,
        }),
    });

    if (!response.ok) {
        try {
            const errorData = await response.json() as { error_description?: string };
            throw new Error(errorData.error_description || 'アクセストークンの取得に失敗しました');
        } catch {
            throw new Error('アクセストークンの取得に失敗しました');
        }
    }

    const data = await response.json() as { error?: string; error_description?: string; access_token?: string };

    if (data.error) {
        throw new Error(data.error_description || 'アクセストークンの取得に失敗しました');
    }

    if (!data.access_token) {
        throw new Error('アクセストークンが取得できませんでした');
    }

    return data.access_token;
};

// GitHubトークンでユーザー情報を取得
export const verifyGitHubToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/user`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/json',
                'User-Agent': 'Blog-App',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('GitHubトークン検証エラー:', error);
        return false;
    }
};

export const getGitHubUser = async (token: string): Promise<{ login: string; [key: string]: any }> => {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/json',
            'User-Agent': 'Blog-App',
        },
    });

    if (!response.ok) {
        throw new Error('GitHubユーザー情報の取得に失敗しました');
    }

    const data = await response.json() as { login: string; [key: string]: any };
    return data;
};
