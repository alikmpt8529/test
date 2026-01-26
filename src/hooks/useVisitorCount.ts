import { useState, useEffect } from 'react';

export const useVisitorCount = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        const currentCount = Number(localStorage.getItem('visitorCount') || 0);
        const newCount = currentCount + 1;
        localStorage.setItem('visitorCount', String(newCount));
        setVisitorCount(newCount);
    }, []);

    return visitorCount;
};
