import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '90d';

interface SessionPayload {
    username: string;
    iat?: number;
    exp?: number;
}

export const generateSessionToken = (username: string): string => {
    return jwt.sign({ username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifySessionToken = (token: string): SessionPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
        return decoded;
    } catch (error) {
        console.error('セッショントークン検証エラー:', error);
        return null;
    }
};
