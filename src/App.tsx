import { useState, useEffect } from 'react';

function App() {
    // Get the current count from local storage
    const currentCount = Number(localStorage.getItem('visitorCount') || 0);

    // Increment the count
    const newCount = currentCount + 1;

    // Save the new count to local storage
    localStorage.setItem('visitorCount', String(newCount));

    const [currentTab, setCurrentTab] = useState('home');
    const [visitorCount, setVisitorCount] = useState(newCount);

    useEffect(() => {
        // Update the state
        setVisitorCount(newCount);
    }, [newCount]);

    // ... rest of the code
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <div style={{ display: 'flex' }}>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('home')}>Home</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('blog')}>Blog</button>
                <button style={{ flex: 1 }} onClick={() => setCurrentTab('activities')}>Activities</button>
            </div>
            {currentTab === 'home' && (
                <div>
                    <h1>遊び場</h1>
                    <p className="read-the-docs">
                    </p>
                    <h2>更新記録</h2>
                    <ul>
                        <li>2024-06-09: プロジェクト作成</li>
                        <li>画面遷移機能追加</li>
                        <li>ブログリンク追加</li>
                        <li>unityroomへのリンクを追加しました。</li>
                        <li>2024-06-12: カウンター機能を追加(preview版)</li>
                    </ul>
                    <h3>ｘアカウント</h3>
                    <button onClick={() => window.open('https://x.com/alikmpt', '_blank')}>
                        {"x"}
                    </button>
                    
                    <p>訪問者数: {visitorCount}</p> {/* Display the visitor count */}
                </div>
            )}
            {currentTab === 'blog' && (
                <div>
                    <h2>開発者の雑記はこちら</h2>
                    <button onClick={() => window.open('https://note.com/alikmpt', '_blank')}>
                        {"to blog"}
                    </button>
                </div>
            )}
            {currentTab === 'activities' && (
                <div>
                    <h2>Activities</h2>
                    <p>unityroomで公開しているゲーム</p>
                    <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>
                        {"とにかく寝ろ!!"}
                    </button>
                    <button onClick={() => window.open('https://unityroom.com/games/ankokushissou', '_blank')}>
                        {"暗黒疾走"}
                    </button>
                    <p>過去にreactを活用したもの</p>
                    <button onClick={() => window.open('https://todo-5o4.pages.dev/', '_blank')}>
                        {"todo"}
                    </button>
                    {/* Activities content goes here */}
                </div>
            )}
        </div>
    )
}

export default App;