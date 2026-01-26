import axios, { AxiosInstance, AxiosError } from 'axios';

// APIベースURLを取得
const getApiBaseUrl = (): string => {
    // 環境変数が設定されている場合はそれを使用（本番・開発共通）
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // 開発環境のデフォルト値
    if (!import.meta.env.PROD) {
        return 'http://localhost:3001/api';
    }
    // 本番環境で環境変数が設定されていない場合は同じオリジンを使用
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Axiosインスタンスを作成（Cookieを自動送信）
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// エラーハンドリング
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // ネットワークエラーやサーバーエラーの場合でもアプリがクラッシュしないようにする
        console.error('APIエラー:', error);
        return Promise.reject(error);
    }
);

// 認証API
export const authAPI = {
    // GitHub OAuth認証を開始
    startOAuth: () => {
        // バックエンドのOAuthエンドポイントにリダイレクト
        const oauthUrl = `${API_BASE_URL}/auth/github`;
        window.location.href = oauthUrl;
    },

    // GitHubトークンでログイン（後方互換性のため残す）
    login: async (token: string) => {
        try {
            const response = await apiClient.post('/auth/login', { token });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                // サーバーからのエラーレスポンス
                throw new Error(error.response.data?.error || 'ログインに失敗しました');
            } else if (error.request) {
                // リクエストは送信されたが、レスポンスが受信されなかった
                throw new Error('サーバーに接続できませんでした。バックエンドサーバーが起動しているか確認してください。');
            } else {
                // リクエストの設定中にエラーが発生
                throw new Error('リクエストの送信に失敗しました');
            }
        }
    },

    // 現在の認証状態を確認
    checkAuth: async () => {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error: any) {
            // 401エラー（未認証）の場合は正常な状態として扱う
            if (error.response?.status === 401) {
                return { authenticated: false };
            }
            // その他のエラーはログに記録するが、アプリは続行
            console.error('認証確認エラー:', error);
            return { authenticated: false };
        }
    },

    // ログアウト
    logout: async () => {
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            // ログアウトエラーは無視（既にログアウトしている可能性がある）
            console.error('ログアウトエラー:', error);
            return { success: true };
        }
    },
};

// 記事API
export const articlesAPI = {
    // 記事一覧取得
    getArticles: async () => {
        try {
            const response = await apiClient.get('/articles');
            return response.data;
        } catch (error: any) {
            console.error('記事取得エラー:', error);
            // エラーが発生した場合は空配列を返す
            if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
                return [];
            }
            throw error;
        }
    },

    // 記事投稿
    createArticle: async (title: string, content: string) => {
        try {
            const response = await apiClient.post('/articles', { title, content });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.error || '記事の投稿に失敗しました');
            } else if (error.request) {
                throw new Error('サーバーに接続できませんでした。');
            } else {
                throw new Error('リクエストの送信に失敗しました');
            }
        }
    },
};

export default apiClient;
