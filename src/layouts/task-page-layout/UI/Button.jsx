import { useState, useEffect } from "react";
import {
  completeTask,
  fetchPlayerIdByDocumentId,
  fetchTaskIdByDocumentId
} from "../../../services/taskService";

const Button = ({ task, clicks, level, playerId }) => {
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
        await completeTask(task.documentId, playerId);
        setState("claimed");
      } catch (err) {
        console.error("Ошибка при выполнении задачи:", err);
      } finally {
        setLoading(false);
      }
    }
  };

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
      {loading ? "..." : state === "ready" ? "ПОЛУЧИТЬ" : "ВЫПОЛНИТЬ"}
    </button>
  );
};

export default Button;
