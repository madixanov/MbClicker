import { useState, useEffect } from "react";
import { completeTask, fetchPlayerIdByDocumentId } from "../../../services/taskService";

const Button = ({ task, clicks, level, playerId }) => {
    const [realPlayerId, setRealPlayerId] = useState(null);
    const [state, setState] = useState("initial"); // 'initial' | 'ready' | 'claimed'
    const [loading, setLoading] = useState(false);

    const isLevelTask = task.Name.includes("LVL");
    const progressValue = isLevelTask ? level : clicks;

    // 1. Получаем настоящий Strapi ID игрока
    useEffect(() => {
        const init = async () => {
        try {
            const strapiId = await fetchPlayerIdByDocumentId(playerId);
            setRealPlayerId(strapiId);

            const alreadyCompleted = task.completedBy?.some(
            (user) => user.id === strapiId
            );

            if (alreadyCompleted) {
            setState("claimed");
            }
        } catch (err) {
            console.error("Ошибка при инициализации кнопки:", err);
        }
        };

        init();
    }, [playerId, task.completedBy]);

    const handleClick = async () => {
        if (loading || !realPlayerId) return;

        // Шаг 1: Проверка выполнения
        if (state === "initial") {
        const isReady = progressValue >= task.Goal;
        if (isReady) {
            setState("ready");
        } else {
            alert("Вы ещё не выполнили задание.");
        }
        }

        // Шаг 2: Получение награды
        else if (state === "ready") {
        setLoading(true);
        try {
            await completeTask(task.id, realPlayerId);
            setState("claimed");
        } catch (err) {
            console.error("Ошибка при выполнении задачи:", err);
        } finally {
            setLoading(false);
        }
        }
    };

    // UI в зависимости от состояния
    if (state === "claimed") {
        return <span className="task-done">✅ ВЫПОЛНЕНО</span>;
    }

    return (
        <button
        className={`task-btn ${
            state === "ready" ? "completed" : "active"
        }`}
        onClick={handleClick}
        disabled={loading}
        >
        {loading
            ? "..."
            : state === "ready"
            ? "ПОЛУЧИТЬ"
            : "ВЫПОЛНИТЬ"}
        </button>
    );
};

export default Button;
