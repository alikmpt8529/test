import VisitorCounter from './VisitorCounter';
import UpdateHistory from './UpdateHistory';

interface HomeTabProps {
    visitorCount: number;
}

const HomeTab = ({ visitorCount }: HomeTabProps) => {
    return (
        <>
            <div className="header-background">
                <h1>遊び場</h1>
                <p>powered by react&cloudflare</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                <div>
                    <UpdateHistory />
                    <h3>ｘアカウント</h3>
                    <button onClick={() => window.open('https://x.com/alikmpt', '_blank')}>
                        {"x"}
                    </button>
                    <VisitorCounter count={visitorCount} />
                </div>
            </div>
        </>
    );
};

export default HomeTab;
