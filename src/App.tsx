import { useState, useEffect } from 'react';
import myImage from './1.png';

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [visitorCount, setVisitorCount] = useState(0);
    const [showAllUpdates, setShowAllUpdates] = useState(false);

    useEffect(() => {
        const currentCount = Number(localStorage.getItem('visitorCount') || 0);
        const newCount = currentCount + 1;
        localStorage.setItem('visitorCount', String(newCount));
        setVisitorCount(newCount);
    }, []);

    const updates = [
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
        { date: new Date('2024-06-27'), text: '画面配置変更'}
    ];

    updates.sort((a, b) => b.date.getTime() - a.date.getTime());

    const displayedUpdates = showAllUpdates ? updates : updates.slice(0, 5);

    const counterStyle = {
        color: 'orange',
        fontFamily: '"Digital-7 Mono", monospace',
        fontSize: '24px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <div style={{ display: 'flex' }}>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('home')}>Home</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('blog')}>Blog</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('activities')}>Activities</button>
            </div>
            {currentTab === 'home' && (
                <div className="header-background">
                    <h1>遊び場</h1>
                    <p>powered by react&cloudflare</p>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '100px', paddingTop: '20px', marginLeft: '-50px' }}>
                {currentTab === 'home' && (
                    <div>

                        <h2>更新記録</h2>
                        <ul onMouseEnter={() => setShowAllUpdates(true)} onMouseLeave={() => setShowAllUpdates(false)}>
                            {displayedUpdates.map((update, index) => (
                                <li key={index}>{update.date.toLocaleDateString()}: {update.text}</li>
                            ))}
                        </ul>
                        <h3>ｘアカウント</h3>
                        <button onClick={() => window.open('https://x.com/alikmpt', '_blank')}>{"x"}</button>
                        <p>訪問者数: <span style={counterStyle}>{visitorCount}</span></p>
                    </div>
                )}
                {currentTab === 'blog' && (
                    <div>
                        <h2>開発者の雑記はこちら</h2>
                        <button onClick={() => window.open('https://note.com/alikmpt', '_blank')}>{"to blog"}</button>
                    </div>
                )}
                {currentTab === 'activities' && (
                    <div>
                        <p>制作した作品群</p>
                        <h2>unity activities</h2>
                        <p>unityroomで公開しているゲーム</p>
                        <p>とにかく寝ろ!!</p>
                        <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>{"とにかく寝ろ!!"}</button>
                        <p>play demo</p>
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/4Jix28oHKAs"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                        <p>暗黒疾走</p>
                        <button onClick={() => window.open('https://unityroom.com/games/ankokushissou', '_blank')}>{"暗黒疾走"}</button>
                        <h2>react activities</h2>
                        <p>todo app</p>
                        <button onClick={() => window.open('https://todo2-8qs.pages.dev/', '_blank')}>{"todo"}</button>
                        <p>preview画像</p>
                        <img src={myImage} alt="Todo App" width="400" height="200" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;