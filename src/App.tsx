import { useState } from 'react'
 import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('home')

  return (
    <>
      <div>
        <button onClick={() => setCurrentTab('home')}>Home</button>
        <button onClick={() => setCurrentTab('blog')}>Blog</button>
        <button onClick={() => setCurrentTab('activities')}>Activities</button>
      </div>
      {currentTab === 'home' && (
        <div>
          <h1>homepage</h1>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          <h2>更新記録</h2>
          <ul>
            <li>2024-06-09: プロジェクト作成</li>
            <li>画面遷移機能追加</li>
            <li>ブログリンク追加</li>
          </ul>

        </div>
      )}
      {currentTab === 'blog' && (
        <div>
          <button onClick={() => window.open('https://note.com/alikmpt', '_blank')}>
            {"to blog"}
          </button>
        </div>
      )}
      {currentTab === 'activities' && (
        <div>
          <h2>ここでは過去に開発したゲームのうちunity roomで公開しているものを紹介します</h2>
          <h2>unityroomへはこちら</h2>
          <button onClick={() => window.open('https://unityroom.com/settings/games', '_blank')}>
            {"unityroom"}
          </button>
          
        </div>
      )}
    </>
  )
}

export default App