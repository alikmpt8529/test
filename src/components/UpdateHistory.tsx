import { useState } from 'react';
import { getSortedUpdates } from '../data/updates';

const UpdateHistory = () => {
    const [showAllUpdates, setShowAllUpdates] = useState(false);
    const updates = getSortedUpdates();
    const displayedUpdates = showAllUpdates ? updates : updates.slice(0, 5);

    return (
        <div>
            <h2>更新記録</h2>
            <ul 
                onMouseEnter={() => setShowAllUpdates(true)} 
                onMouseLeave={() => setShowAllUpdates(false)}
            >
                {displayedUpdates.map((update, index) => (
                    <li key={index}>
                        {update.date.toLocaleDateString()}: {update.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpdateHistory;
