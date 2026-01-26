import { useState, useEffect } from 'react';
import { Article } from './ArticlePost';
import { articlesAPI } from '../api/client';

interface ArticleListProps {
    refreshTrigger?: number;
}

const ArticleList = ({ refreshTrigger }: ArticleListProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadArticles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await articlesAPI.getArticles();
            setArticles(data);
        } catch (error: any) {
            console.error('記事取得エラー:', error);
            setError(error.response?.data?.error || '記事の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, [refreshTrigger]);

    if (isLoading) {
        return (
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <p>記事を読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid #f44336' }}>
                <p style={{ margin: 0, color: '#c62828' }}>エラー: {error}</p>
                <button onClick={loadArticles} style={{ marginTop: '10px' }}>再試行</button>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div style={{ 
                marginTop: '30px', 
                padding: '40px', 
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                border: '1px dashed #ccc'
            }}>
                <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                    まだ記事がありません。
                </p>
                <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                    認証後、記事を投稿してください。
                </p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '30px', maxWidth: '800px', width: '100%' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
                投稿された記事 {articles.length > 0 && `(${articles.length}件)`}
            </h3>
            <div>
                {articles.map((article, index) => (
                    <div
                        key={article.id}
                        style={{
                            marginBottom: '20px',
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <h4 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
                                {article.title}
                            </h4>
                            <span style={{ 
                                fontSize: '12px', 
                                color: '#999',
                                backgroundColor: '#f0f0f0',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                #{index + 1}
                            </span>
                        </div>
                        <p style={{ 
                            whiteSpace: 'pre-wrap', 
                            marginBottom: '15px', 
                            lineHeight: '1.8',
                            color: '#555',
                            fontSize: '15px'
                        }}>
                            {article.content}
                        </p>
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            paddingTop: '15px',
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }}>
                            <span>
                                <strong>投稿者:</strong> {article.author}
                            </span>
                            <span>
                                <strong>投稿日時:</strong> {new Date(article.createdAt).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticleList;
