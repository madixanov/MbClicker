import { useEffect, useState } from 'react';

function getDayNumber(createdAt) {
    const createdDate = new Date(createdAt);
    const today = new Date();

    createdDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1;
}

export default function DayCounter({ createdAt }) {
    const [ day, setDay ] = useState(1);

    useEffect(() => {
        if (createdAt) {
            setDay(getDayNumber(createdAt));
        }
    }, [createdAt]);

    return <>{day} ДЕНЬ</>
}