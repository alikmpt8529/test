import { useState } from 'react';
import GitHubAuth from './GitHubAuth';
import ArticlePost from './ArticlePost';
import ArticleList from './ArticleList';
import { useAuth } from '../contexts/AuthContext';

const BlogTab = () => {
    const { isAuthenticated } = useAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleArticlePosted = () => {
        // 記事一覧を更新するためにrefreshTriggerを変更
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ width: '100%' }}>
                <h2>開発者の雑記はこちら</h2>
                <button onClick={() => window.open('https://note.com/alikmpt', '_blank')}>
                    {"to blog"}
                </button>
                
                <div style={{ marginTop: '30px', width: '100%' }}>
                    <h3>記事投稿機能</h3>
                    <GitHubAuth />
                    {isAuthenticated && <ArticlePost onArticlePosted={handleArticlePosted} />}
                </div>
                
                <div style={{ marginTop: '40px', width: '100%' }}>
                    <ArticleList refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};

export default BlogTab;
