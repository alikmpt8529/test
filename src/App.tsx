import { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import HomeTab from './components/HomeTab';
import BlogTab from './components/BlogTab';
import ActivitiesTab from './components/ActivitiesTab';
import { useVisitorCount } from './hooks/useVisitorCount';
import { AuthProvider } from './contexts/AuthContext';

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const visitorCount = useVisitorCount();

    return (
        <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
                <TabNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
                {currentTab === 'home' && <HomeTab visitorCount={visitorCount} />}
                {currentTab === 'blog' && <BlogTab />}
                {currentTab === 'activities' && <ActivitiesTab />}
            </div>
        </AuthProvider>
    );
}

export default App;