import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ALLOWED_USERNAME = 'alikmpt8529';

const GitHubAuth = () => {
    const { user, logout, isLoading: authLoading, checkAuth } = useAuth();
    const [error, setError] = useState<string | null>(null);

    // URLパラメータからエラーを確認
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const authParam = urlParams.get('auth');

        if (errorParam) {
            switch (errorParam) {
                case 'unauthorized':
                    const userParam = urlParams.get('user');
                    setError(`認証できるのは${ALLOWED_USERNAME}アカウントのみです。${userParam ? `現在のアカウント: ${userParam}` : ''}`);
                    break;
                case 'oauth_failed':
                    setError('OAuth認証に失敗しました。もう一度お試しください。');
                    break;
                case 'no_code':
                    setError('認証コードが取得できませんでした。');
                    break;
                default:
                    setError('認証に失敗しました。');
            }
            // URLからエラーパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (authParam === 'success') {
            // 認証成功時、認証状態を再確認
            checkAuth();
            // URLからパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [checkAuth]);

    const handleOAuthLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            console.log('GitHubログインボタンがクリックされました');
            
            // API_BASE_URLを確認
            const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');
            console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
            console.log('PROD:', import.meta.env.PROD);
            console.log('API_BASE_URL:', apiBaseUrl);
            
            if (!apiBaseUrl || apiBaseUrl === '/api') {
                const errorMsg = 'VITE_API_URLが設定されていません。Cloudflare Pagesの環境変数にVITE_API_URLを設定してください。';
                console.error(errorMsg);
                setError(errorMsg);
                return;
            }
            
            const oauthUrl = `${apiBaseUrl}/auth/github`;
            console.log('OAuth URL:', oauthUrl);
            
            // リダイレクト
            window.location.href = oauthUrl;
        } catch (error: any) {
            console.error('OAuth認証開始エラー:', error);
            setError(error.message || 'OAuth認証の開始に失敗しました');
        }
    };

    // 認証状態の読み込み中
    if (authLoading) {
        return (
            <div style={{ marginBottom: '20px', padding: '15px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p>認証状態を確認中...</p>
            </div>
        );
    }

    // 既に認証済み
    if (user) {
        return (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>✓ 認証済み: {user.username}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                    セッションはHttpOnly Cookieで安全に管理されています。
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#4CAF50' }}>
                    ✓ 自動認証が有効です。ページをリロードしても認証状態が維持されます。
                </p>
                <button onClick={logout} style={{ marginTop: '10px' }}>ログアウト</button>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>GitHub認証</h4>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                注意: {ALLOWED_USERNAME}アカウントのみ認証可能です
                <br />
                <span style={{ color: '#2196F3' }}>※ GitHubでログインボタンをクリックするだけで認証できます</span>
            </p>
            
            {/* セキュリティ情報 */}
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px', border: '1px solid #2196F3' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#1565C0' }}>
                    <strong>セキュリティ:</strong>
                    <br />
                    • OAuth認証を使用するため、トークンを手動で入力する必要がありません
                    <br />
                    • セッションはHttpOnly Cookieで安全に管理されます
                    <br />
                    • ブラウザのJavaScriptから直接アクセスできないため、XSS攻撃に対して安全です
                    <br />
                    • セッションは90日間有効です
                </p>
            </div>

            {error && (
                <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #f44336' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#c62828' }}>エラー</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#c62828' }}>{error}</p>
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '11px', color: '#856404' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>解決方法:</p>
                        <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
                            <li>Cloudflare Pagesのダッシュボードで「Settings」→「Environment variables」を開く</li>
                            <li><code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' }}>VITE_API_URL</code>を追加</li>
                            <li>値: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' }}>https://your-render-app.onrender.com/api</code></li>
                            <li>再デプロイ</li>
                        </ol>
                    </div>
                </div>
            )}
            
            <div>
                <button 
                    onClick={handleOAuthLogin}
                    type="button"
                    disabled={!!error}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        backgroundColor: error ? '#ccc' : '#24292e',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: error ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto',
                        opacity: error ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!error) {
                            e.currentTarget.style.backgroundColor = '#1a1e22';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!error) {
                            e.currentTarget.style.backgroundColor = '#24292e';
                        }
                    }}
                >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHubでログイン
                </button>
            </div>
        </div>
    );
};

export default GitHubAuth;
