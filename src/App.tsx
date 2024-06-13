import { useState, useEffect } from 'react';
import myImage from './1.png';
function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [visitorCount, setVisitorCount] = useState(0);
    const [displayedUpdates] = useState(5); // Remove the unused setDisplayedUpdates

    useEffect(() => {
        // Get the current count from local storage
        const currentCount = Number(localStorage.getItem('visitorCount') || 0);

        // Increment the count
        const newCount = currentCount + 1;

        // Save the new count to local storage
        localStorage.setItem('visitorCount', String(newCount));

        // Update the state
        setVisitorCount(newCount);
    }, []);
const updates=[
    {date:new Date('2024-06-12'),text:'動画再生機能を追加しました(activitiesタブ)'},
    {date:new Date('2024-06-12'),text:'カウンター機能を追加(preview版)'},
    {date:new Date('2024-06-09'),text:'unityroomへのリンクを追加しました。'},
    {date:new Date('2024-06-09'),text:'ブログリンク追加'},
    {date:new Date('2024-06-09'),text:'画面遷移機能追加'},
    {date:new Date('2024-06-09'),text:'プロジェクト作成'},
    
]
updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                    {updates.slice(0, displayedUpdates).map((update, index) => (
                        <li key={index}>{update.date.toLocaleDateString()}: {update.text}</li>
                    ))}
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
                    <p>とにかく寝ろ!!</p>
                    <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>
                        {"とにかく寝ろ!!"}
                    </button>
                    <p>playデモ</p>
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
                    <button onClick={() => window.open('https://unityroom.com/games/ankokushissou', '_blank')}>
                        {"暗黒疾走"}
                    </button>
                    <p>過去にreactを活用したもの</p>
                    <button onClick={() => window.open('https://todo-5o4.pages.dev/', '_blank')}>
                        {"todo"}
                    </button>
                    <p>preview画像</p>
                    <img src={myImage} alt="Todo App" width="400" height="200" />
                    {/* Activities content goes here */}
                </div>
            )}
        </div>
    )
}

export default App;

