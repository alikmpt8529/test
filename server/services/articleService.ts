import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_FILE = path.join(__dirname, '../data/articles.json');

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

// 記事ファイルの初期化
const ensureArticlesFile = async (): Promise<void> => {
    try {
        await fs.access(ARTICLES_FILE);
    } catch {
        await fs.mkdir(path.dirname(ARTICLES_FILE), { recursive: true });
        await fs.writeFile(ARTICLES_FILE, JSON.stringify([], null, 2));
    }
};

// 記事一覧取得（パース失敗時は空配列を返し 500 を防ぐ）
export const getArticles = async (): Promise<Article[]> => {
    await ensureArticlesFile();
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    let articles: Article[];
    try {
        const parsed = JSON.parse(data);
        articles = Array.isArray(parsed) ? parsed : [];
    } catch {
        console.warn('記事ファイルのパースに失敗しました。空配列を返します。', ARTICLES_FILE);
        return [];
    }

    // 日付でソート（新しい順）
    return articles.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// 記事作成
export const createArticle = async (articleData: {
    title: string;
    content: string;
    author: string;
}): Promise<Article> => {
    await ensureArticlesFile();
    
    const articles = await getArticles();
    
    const newArticle: Article = {
        id: Date.now().toString(),
        title: articleData.title,
        content: articleData.content,
        author: articleData.author,
        createdAt: new Date().toISOString(),
    };

    articles.unshift(newArticle);
    
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    
    return newArticle;
};
