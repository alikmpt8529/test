import { useState, useEffect } from 'react';
import myImage from './1.png';

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [visitorCount, setVisitorCount] = useState(0);
    const [showAllUpdates, setShowAllUpdates] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ダークモードの状態を監視
    useEffect(() => {
        const matchDark = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(matchDark.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        matchDark.addEventListener('change', handleChange);

        return () => matchDark.removeEventListener('change', handleChange);
    }, []);

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
        { date: new Date('2024-06-24'), text: 'ブラウザのダークモードに対応' },
    
    ];

    updates.sort((a, b) => b.date.getTime() - a.date.getTime());

    const displayedUpdates = showAllUpdates ? updates : updates.slice(0, 5);

    const counterStyle = {
        color: isDarkMode ? 'lightgreen' : 'orange',
        fontFamily: '"Digital-7 Mono", monospace',
        fontSize: '24px',
    };

    const appStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: isDarkMode ? '#b5e6fd' : '#b5e6fd',
        color: isDarkMode ? '#FFF' : '#000',
    };

    // ダークモード時のテキストスタイルを追加
    const darkModeTextStyle = {
        color: isDarkMode ? '#FFF' : '#000',
    };

    return (
        <div style={appStyle}>
            <div style={{ display: 'flex' }}>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('home')}>Home</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('blog')}>Blog</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('activities')}>Activities</button>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                {currentTab === 'home' && (
                    <div>
                        <h1 style={darkModeTextStyle}>遊び場</h1>
                        <p style={darkModeTextStyle}>powered by react&cloudflare</p>
                        <h2 style={darkModeTextStyle}>更新記録</h2>
                        <ul onMouseEnter={() => setShowAllUpdates(true)} onMouseLeave={() => setShowAllUpdates(false)}>
                            {displayedUpdates.map((update, index) => (
                                <li key={index} style={darkModeTextStyle}>{update.date.toLocaleDateString()}: {update.text}</li>
                            ))}
                        </ul>
                        <h3 style={darkModeTextStyle}>ｘアカウント</h3>
                        <button onClick={() => window.open('https://x.com/alikmpt', '_blank')}>{"x"}</button>
                        <p style={darkModeTextStyle}>訪問者数: <span style={counterStyle}>{visitorCount}</span></p>
                    </div>
                )}
                {currentTab === 'blog' && (
                    <div>
                        <h2 style={darkModeTextStyle}>開発者の雑記はこちら</h2>
                        <button onClick={() => window.open('https://note.com/alikmpt', '_blank')}>{"to blog"}</button>
                    </div>
                )}
                {currentTab === 'activities' && (
                    <div>
                        <p style={darkModeTextStyle}>制作した作品群</p>
                        <h2 style={darkModeTextStyle}>unity activities</h2>
                        <p style={darkModeTextStyle}>unityroomで公開しているゲーム</p>
                        <p style={darkModeTextStyle}>とにかく寝ろ!!</p>
                        <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>{"とにかく寝ろ!!"}</button>
                        <p style={darkModeTextStyle}>play demo</p>    
                            <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/4Jix28oHKAs"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                        <p style={darkModeTextStyle}>暗黒疾走</p>
                        <button onClick={() => window.open('https://unityroom.com/games/ankokushissou', '_blank')}>{"暗黒疾走"}</button>
                        <h2 style={darkModeTextStyle}>react activities</h2>
                        <p style={darkModeTextStyle}>todo app</p>
                        <button onClick={() => window.open('https://todo2-8qs.pages.dev/', '_blank')}>{"todo"}</button>
                        <p style={darkModeTextStyle}>preview画像</p>
                        <img src={myImage} alt="Todo App" width="400" height="200" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;