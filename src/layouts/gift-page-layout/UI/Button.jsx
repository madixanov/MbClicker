import { useState } from "react";

const Button = () => {
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleClick = () => {
        if (isActive || isCompleted) return; 
        setIsActive(true);
        setTimeout(() => {
            setIsCompleted(true);
        }, 3000);
    };

    return (
        <button
            onClick={handleClick}
            className={`task-btn ${isActive ? "active-btn" : ""} ${isCompleted ? "completed" : ""}`}
        >
            {isCompleted ? "ACCEPT" : isActive ? "CHECK" : "PERFORM"}
        </button>
    );
};

export default Button;
