import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/client';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const ALLOWED_USERNAME = 'alikmpt8529';

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 認証状態を確認
    const checkAuth = async () => {
        try {
            const data = await authAPI.checkAuth();
            if (data.authenticated && data.user?.username === ALLOWED_USERNAME) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('認証確認エラー:', error);
            // エラーが発生してもアプリは続行（未認証状態として扱う）
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 初回マウント時に認証状態を確認
        checkAuth();
    }, []);

    const login = async (username: string, token: string) => {
        try {
            if (username !== ALLOWED_USERNAME) {
                throw new Error('認証できるのはalikmpt8529アカウントのみです');
            }

            const data = await authAPI.login(token);
            
            if (data.success && data.user?.username === ALLOWED_USERNAME) {
                setUser(data.user);
            } else {
                throw new Error('ログインに失敗しました');
            }
        } catch (error: any) {
            console.error('ログインエラー:', error);
            throw error;
        }
    };

    const logout = async () => {
        // 先にUIを未認証にする（APIが遅い・失敗してもボタンは確実に効く）
        setUser(null);
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('ログアウトエラー:', error);
            // Cookieの削除はバックエンド任せ。ローカル状態は既にクリア済み
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
