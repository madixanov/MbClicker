import { useState } from "react";

const Button = () => {
    const [status, setStatus] = useState("idle");

    const handleClick = () => {
        if (status !== "idle") return;

        setStatus("checking");
    };

    const getLabel = () => {
        switch (status) {
            case "done":
                return "ПОЛУЧИТЬ";
            case "checking":
                return "ПРОВЕРКА";
            default:
                return "ВЫПОЛНИТЬ";
        }
    };

    return (
        <button
            aria-label={getLabel()}
            onClick={handleClick}
            className={`task-btn ${status === "checking" ? "active-btn" : ""} ${status === "done" ? "completed" : ""}`}
        >
            {getLabel()}
        </button>
    );
};

export default Button;
