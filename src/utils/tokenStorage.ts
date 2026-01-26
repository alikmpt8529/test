// セキュアなトークンストレージユーティリティ
// 注意: フロントエンドのみの実装では完全なセキュリティは難しいため、
// 本番環境ではバックエンドAPIとHttpOnly Cookieの使用を推奨します

const STORAGE_KEY = 'github_auth_data';
const OLD_STORAGE_KEY = 'github_user'; // 旧バージョンとの互換性のため
const TOKEN_EXPIRY_DAYS = 90; // トークンの有効期限（日数）

interface StoredAuthData {
    username: string;
    encryptedToken: string;
    savedAt: string;
    lastVerified: string;
}

// 簡易的な暗号化（本番環境ではより強力な暗号化を推奨）
const encryptToken = (token: string): string => {
    // Base64エンコード + 簡単なシフト（実際の本番環境ではより強力な暗号化が必要）
    const encoded = btoa(token);
    return encoded.split('').reverse().join('');
};

const decryptToken = (encryptedToken: string): string => {
    try {
        const reversed = encryptedToken.split('').reverse().join('');
        return atob(reversed);
    } catch (error) {
        console.error('トークンの復号化エラー:', error);
        throw new Error('トークンの復号化に失敗しました');
    }
};

// 旧バージョンのデータを移行
const migrateOldData = (): void => {
    try {
        const oldData = localStorage.getItem(OLD_STORAGE_KEY);
        if (oldData) {
            const parsed = JSON.parse(oldData);
            if (parsed.username && parsed.accessToken) {
                // 旧データを新形式に移行
                saveAuthToken(parsed.username, parsed.accessToken);
                // 旧データを削除
                localStorage.removeItem(OLD_STORAGE_KEY);
                console.log('旧バージョンのデータを移行しました');
            }
        }
    } catch (error) {
        console.error('データ移行エラー:', error);
        // エラーが発生した場合は旧データを削除
        localStorage.removeItem(OLD_STORAGE_KEY);
    }
};

export const saveAuthToken = (username: string, token: string): void => {
    try {
        const encryptedToken = encryptToken(token);
        const authData: StoredAuthData = {
            username,
            encryptedToken,
            savedAt: new Date().toISOString(),
            lastVerified: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        console.log('トークンを安全に保存しました');
    } catch (error) {
        console.error('トークン保存エラー:', error);
        throw error;
    }
};

export const getAuthToken = (): { username: string; token: string } | null => {
    try {
        // 初回実行時に旧データを移行
        migrateOldData();
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }

        const authData: StoredAuthData = JSON.parse(stored);
        
        // 有効期限チェック
        const savedDate = new Date(authData.savedAt);
        const expiryDate = new Date(savedDate);
        expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS);
        
        if (new Date() > expiryDate) {
            console.warn('保存されたトークンの有効期限が切れています');
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        const token = decryptToken(authData.encryptedToken);
        return {
            username: authData.username,
            token,
        };
    } catch (error) {
        console.error('トークン取得エラー:', error);
        // エラーが発生した場合は保存データを削除
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

export const removeAuthToken = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    // 旧データも削除（念のため）
    localStorage.removeItem(OLD_STORAGE_KEY);
};

export const updateLastVerified = (): void => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const authData: StoredAuthData = JSON.parse(stored);
            authData.lastVerified = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        }
    } catch (error) {
        console.error('最終検証日時の更新エラー:', error);
    }
};

export const hasStoredToken = (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null || localStorage.getItem(OLD_STORAGE_KEY) !== null;
};
