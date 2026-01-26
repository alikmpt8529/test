import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { articlesAPI } from '../api/client';

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

interface ArticlePostProps {
    onArticlePosted?: () => void;
}

const ArticlePost = ({ onArticlePosted }: ArticlePostProps) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!title.trim() || !content.trim()) {
            setError('タイトルと内容を入力してください');
            return;
        }

        setIsSubmitting(true);
        try {
            await articlesAPI.createArticle(title.trim(), content.trim());
            
            // フォームをリセット
            setTitle('');
            setContent('');
            
            // 親コンポーネントに通知して記事一覧を更新
            if (onArticlePosted) {
                onArticlePosted();
            }
        } catch (error: any) {
            console.error('記事投稿エラー:', error);
            setError(error.response?.data?.error || '記事の投稿に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px' }}>
            <h3>新しい記事を投稿</h3>
            {error && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #f44336' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#c62828' }}>{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        タイトル:
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setError(null);
                        }}
                        style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="記事のタイトルを入力"
                        disabled={isSubmitting}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        内容:
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setError(null);
                        }}
                        style={{ width: '100%', minHeight: '200px', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                        placeholder="記事の内容を入力"
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', fontSize: '16px', opacity: isSubmitting ? 0.6 : 1 }}>
                    {isSubmitting ? '投稿中...' : '投稿する'}
                </button>
            </form>
        </div>
    );
};

export default ArticlePost;
