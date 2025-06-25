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
  const [state, setState] = useState("initial");
  const [loading, setLoading] = useState(false);
  const [claimedOnce, setClaimedOnce] = useState(false); // ✅

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

        if (alreadyCompleted || claimedOnce) {
          setState("claimed");
        }
      } catch (err) {
        console.error("Ошибка при инициализации кнопки:", err);
      }
    };

    init();
  }, [playerId, task.documentId, task.completedBy, claimedOnce]); // ✅ добавили claimedOnce

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

        setClaimedOnce(true); // ✅ зафиксировали, что награда получена
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
      {loading ? "..." : state === "ready" ? "ПОЛУЧИТЬ" : state === "claimed" ? <img src={completed} alt="" /> : "ВЫПОЛНИТЬ"}
    </button>
  );
};

export default Button;
