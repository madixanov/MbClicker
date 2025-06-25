import { useState } from "react";
import axios from "axios";

const Button = ({ task, clicks, playerId }) => {
    const [ claimed, setClaimed ] = useState(false);

    const isReady = clicks >= task.Goal;

    const handleClaim = async () => {
        if (!isReady || claimed) return;

        try {
            await axios.post("https://mbclickerstrapi.onrender.com/api/tasks", {
                data: {
                Name: task.Name,
                Goal: task.Goal,
                Prize: task.Prize,
                Completed: true,
                isTemplate: false,
                player: playerId,
                },
            });

        setClaimed(true);
        } catch (err) {
        console.error("Ошибка при сохранении задачи игроку:", err);
        }
    };

    if (claimed) {
        return <span className="task-done">✅ Получено</span>;
    }

    return (
        <button className="task-btn" onClick={handleClaim} disabled={!isReady}>
        {isReady ? "ПОЛУЧИТЬ" : "Проверка"}
        </button>
    );
};

export default Button;
