import { useState, useEffect } from 'react';
import { visitorsAPI } from '../api/client';

export const useVisitorCount = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const recordVisit = async () => {
            const count = await visitorsAPI.hit();
            if (!cancelled) {
                setVisitorCount(count);
            }
        };

        recordVisit();

        return () => {
            cancelled = true;
        };
    }, []);

    return visitorCount;
};
