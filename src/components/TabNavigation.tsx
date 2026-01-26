interface TabNavigationProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation = ({ currentTab, onTabChange }: TabNavigationProps) => {
    const buttonStyle = (tab: string) => ({
        flex: 1,
        backgroundColor: currentTab === tab ? '#2196F3' : '#f5f5f5',
        color: currentTab === tab ? '#ffffff' : '#333333',
        border: '1px solid #ddd',
        padding: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    });

    return (
        <div style={{ display: 'flex' }}>
            <button 
                style={buttonStyle('home')} 
                onClick={() => onTabChange('home')}
                onMouseEnter={(e) => {
                    if (currentTab !== 'home') {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                    }
                }}
                onMouseLeave={(e) => {
                    if (currentTab !== 'home') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                }}
            >
                Home
            </button>
            <button 
                style={buttonStyle('blog')} 
                onClick={() => onTabChange('blog')}
                onMouseEnter={(e) => {
                    if (currentTab !== 'blog') {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                    }
                }}
                onMouseLeave={(e) => {
                    if (currentTab !== 'blog') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                }}
            >
                Blog
            </button>
            <button 
                style={buttonStyle('activities')} 
                onClick={() => onTabChange('activities')}
                onMouseEnter={(e) => {
                    if (currentTab !== 'activities') {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                    }
                }}
                onMouseLeave={(e) => {
                    if (currentTab !== 'activities') {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                }}
            >
                Activities
            </button>
        </div>
    );
};

export default TabNavigation;
