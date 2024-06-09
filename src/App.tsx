import React, { useState } from 'react';

function App() {
  const [currentTab, setCurrentTab] = useState('home')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div style={{ display: 'flex' }}>
        <button style={{ flex: 1 }} onClick={() => setCurrentTab('home')}>Home</button>
        <button style={{ flex: 1 }} onClick={() => setCurrentTab('blog')}>Blog</button>
        <button style={{ flex: 1 }} onClick={() => setCurrentTab('activities')}>Activities</button>
      </div>
      {currentTab === 'home' && (
        <div>
          <h1>homepage</h1>
          <p className="read-the-docs">
          </p>
          <h2>更新記録</h2>
          <ul>
            <li>2024-06-09: プロジェクト作成</li>
            <li>画面遷移機能追加</li>
            <li>ブログリンク追加</li>
            <li>unityroomへのリンクを追加しました。</li>
          </ul>
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
          <p>unityroomにてゲームを公開しています。</p>
          <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>
            {"とにかく寝ろ!!"}
          </button>
          <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>
            {"暗黒疾走"}
          </button>
          {/* Activities content goes here */}
        </div>
      )}
    </div>
  )
}

export default App;