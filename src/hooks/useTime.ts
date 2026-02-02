import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const useTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return {
        time,
        formattedTime: format(time, 'MMM d HH:mm'),
        fullDate: format(time, 'EEEE, MMMM d, yyyy')
    };
};
