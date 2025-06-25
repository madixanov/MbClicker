import { useState, useEffect } from "react";
import {
  completeTask,
  fetchPlayerIdByDocumentId,
  fetchTaskIdByDocumentId,
  updatePlayerClicks,
} from "../../../services/taskService";


const Button = ({ task, clicks, level, playerId, onUpdateClicks }) => {
    const [realPlayerId, setRealPlayerId] = useState(null);
    const [realTaskId, setRealTaskId] = useState(null);
    const [state, setState] = useState("initial"); // 'initial' | 'ready' | 'claimed'
    const [loading, setLoading] = useState(false);

    const isLevelTask = task.Name.includes("LVL");
    const progressValue = isLevelTask ? level : clicks;

    useEffect(() => {
        const init = async () => {
        try {
            const strapiId = await fetchPlayerIdByDocumentId(playerId);
            const taskId = await fetchTaskIdByDocumentId(task.documentId);

            setRealPlayerId(strapiId);
            setRealTaskId(taskId);

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
    }, [playerId, task.documentId, task.completedBy]);

    const handleClick = async () => {
        if (loading || !realPlayerId || !realTaskId) return;

        if (state === "initial") {
        const isReady = progressValue >= task.Goal;
        if (isReady) {
            setState("ready");
        } else {
            alert("Вы ещё не выполнили задание.");
        }
        } else if (state === "ready") {
        setLoading(true);
        try {
            // 1. Отметить задачу как выполненную
            await completeTask(task.documentId, playerId);

            // 2. Прибавить приз к кликам
            const newClicks = Number(clicks) + Number(task.Prize);
            await updatePlayerClicks(playerId, newClicks);

            // 3. Обновить UI
            if (onUpdateClicks) {
            onUpdateClicks(newClicks);
            }

            setState("claimed");
        } catch (err) {
            console.error("Ошибка при выполнении задачи:", err);
        } finally {
            setLoading(false);
        }
        }
    };

    return (
        <button
        className={`task-btn ${state === "ready" ? "completed" : "active"}`}
        onClick={handleClick}
        disabled={loading}
        >
        {loading ? "..." : state === "ready" ? "ПОЛУЧИТЬ" : "ВЫПОЛНИТЬ"}
        </button>
    );
};

export default Button;
