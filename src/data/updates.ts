export interface Update {
    date: Date;
    text: string;
}

export const updates: Update[] = [
    { date: new Date('2024-06-12'), text: '動画再生機能を追加しました(activitiesタブ)' },
    { date: new Date('2024-06-12'), text: 'カウンター機能を追加(preview版)' },
    { date: new Date('2024-06-09'), text: 'unityroomへのリンクを追加しました。' },
    { date: new Date('2024-06-09'), text: 'ブログリンク追加' },
    { date: new Date('2024-06-09'), text: '画面遷移機能追加' },
    { date: new Date('2024-06-09'), text: 'プロジェクト作成' },
    { date: new Date('2024-06-21'), text: 'アップデート' },
    { date: new Date('2024-06-23'), text: 'アップデート' },
    { date: new Date('2024-06-24'), text: 'todoアプリの更新' },
    { date: new Date('2024-06-24'), text: 'ホバー機能の追加' },
    { date: new Date('2024-06-24'), text: 'ブラウザのダークモード対応' },
    { date: new Date('2024-06-25'), text: 'ホームに画像追加' },
    { date: new Date('2024-06-27'), text: '画面配置変更'},
    { date: new Date('2024-10-28'), text: 'unityroomに新作投稿したことによる変更' },
    { date: new Date('2026-01-27'), text: 'toolsの作成' },
];

export const getSortedUpdates = (): Update[] => {
    return [...updates].sort((a, b) => b.date.getTime() - a.date.getTime());
};
