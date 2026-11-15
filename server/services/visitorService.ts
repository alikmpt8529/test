import { promises as fs } from 'fs';
import { dirname, join } from 'path';

const VISITORS_FILE = join(process.cwd(), 'server', 'data', 'visitors.json');

interface VisitorData {
    count: number;
}

const ensureVisitorsFile = async (): Promise<void> => {
    try {
        await fs.access(VISITORS_FILE);
    } catch {
        await fs.mkdir(dirname(VISITORS_FILE), { recursive: true });
        await fs.writeFile(VISITORS_FILE, JSON.stringify({ count: 0 }, null, 2));
    }
};

const readVisitorData = async (): Promise<VisitorData> => {
    await ensureVisitorsFile();
    const data = await fs.readFile(VISITORS_FILE, 'utf-8');
    try {
        const parsed = JSON.parse(data);
        return {
            count: typeof parsed.count === 'number' && parsed.count >= 0 ? parsed.count : 0,
        };
    } catch {
        console.warn('訪問者ファイルのパースに失敗しました。0 を返します。', VISITORS_FILE);
        return { count: 0 };
    }
};

export const getVisitorCount = async (): Promise<number> => {
    const data = await readVisitorData();
    return data.count;
};

export const incrementVisitorCount = async (): Promise<number> => {
    const data = await readVisitorData();
    data.count += 1;
    await fs.writeFile(VISITORS_FILE, JSON.stringify(data, null, 2));
    return data.count;
};
