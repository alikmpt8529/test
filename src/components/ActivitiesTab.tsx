import myImage from '../1.png';

const ActivitiesTab = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
            <div>
                <p>制作した作品群</p>
                <h2>unity activities</h2>
                <p>unityroomで公開しているゲーム</p>
                <p>とにかく寝ろ!!</p>
                <button onClick={() => window.open('https://unityroom.com/games/tonikaknero', '_blank')}>
                    {"とにかく寝ろ!!"}
                </button>
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
                <button onClick={() => window.open('https://unityroom.com/games/ankokushissou', '_blank')}>
                    {"暗黒疾走"}
                </button>
                <p>Regain your sanity!</p>
                <button onClick={() => window.open('https://unityroom.com/games/regainyoursanity', '_blank')}>
                    {"Regain your sanity!"}
                </button>
                <h2>react activities</h2>
                <p>todo app</p>
                <button onClick={() => window.open('https://todo2-8qs.pages.dev/', '_blank')}>
                    {"todo"}
                </button>
                <p>preview画像</p>
                <img src={myImage} alt="Todo App" width="400" height="200" />
                <p>tools</p>
                <button onClick={() => window.open('https://alikmpt8529.github.io/vial-gui/', '_blank')}>
                    {"vialで設定したキーボードの配列印刷アプリ"}
                </button>
            </div>
        </div>
    );
};

export default ActivitiesTab;
