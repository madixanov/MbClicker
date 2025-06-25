import { useState, useEffect } from "react";
import {
  completeTask,
  fetchPlayerIdByDocumentId,
  fetchTaskIdByDocumentId,
  updatePlayerClicks,
} from "../../../services/taskService";
import completed from "../../../assets/icons/completed.svg";

const Button = ({ task, clicks, level, playerId, onUpdateClicks }) => {
  const [realPlayerId, setRealPlayerId] = useState(null);
  const [realTaskId, setRealTaskId] = useState(null);
  const [state, setState] = useState("initial"); // initial → ready → claimed
  const [loading, setLoading] = useState(false);

  const isLevelTask = task.Name.includes("LVL");
  const progressValue = isLevelTask ? level : clicks;

  // Получаем реальные Strapi ID игрока и задачи
  useEffect(() => {
    const init = async () => {
      try {
        const strapiPlayerId = await fetchPlayerIdByDocumentId(playerId);
        const strapiTaskId = await fetchTaskIdByDocumentId(task.documentId);

        setRealPlayerId(strapiPlayerId);
        setRealTaskId(strapiTaskId);

        const alreadyCompleted = task.completedBy?.some(
          (user) => user.id === strapiPlayerId
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
        await completeTask(task.documentId, playerId);
        const newClicks = Number(clicks) + Number(task.Prize);
        await updatePlayerClicks(playerId, newClicks);

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

  // ✅ Если выполнено — показываем галочку
  if (state === "claimed") {
    return (
      <span className="task-done">
        <img src={completed} alt="Выполнено" />
      </span>
    );
  }

  // 🟡 Иначе — кнопка
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
