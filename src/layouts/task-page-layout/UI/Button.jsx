import { useState, useEffect } from "react";
import {
  completeTask,
  fetchPlayerIdByDocumentId,
  fetchTaskIdByDocumentId,
} from "../../../services/taskService";
import { updatePlayer } from "../../../services/playerService";
import completed from "../../../assets/icons/completed.svg";
import useMbStore from "../../../store/mb-store";

const Button = ({ task, clicks, level, playerId, onUpdateClicks }) => {
  const [realPlayerId, setRealPlayerId] = useState(null);
  const [state, setState] = useState("initial"); // initial → ready → claimed
  const [loading, setLoading] = useState(false);
  const [claimedManually, setClaimedManually] = useState(false);

  const isLevelTask = task.Name.includes("LVL");
  const progressValue = isLevelTask ? level : clicks;

  // ✅ Получаем реальные Strapi ID игрока
  useEffect(() => {
    const init = async () => {
      try {
        const strapiPlayerId = await fetchPlayerIdByDocumentId(playerId);
        setRealPlayerId(strapiPlayerId);
      } catch (err) {
        console.error("Ошибка получения Strapi ID:", err);
      }
    };
    init();
  }, [playerId]);

  // ✅ Проверка: задача уже завершена?
  useEffect(() => {
    if (!realPlayerId || !task.completedBy || state === "claimed" || claimedManually) return;

    const alreadyCompleted = task.completedBy.some(
      (user) => user.id === realPlayerId
    );

    if (alreadyCompleted) {
      setState("claimed");
    }
  }, [realPlayerId, task.completedBy, state, claimedManually]);

  // ✅ Обработка клика
  const handleClick = async () => {
    if (loading || !realPlayerId) return;

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
        // 1. Завершаем задачу в Strapi
        await completeTask(task.documentId, playerId);

        // 2. Считаем награду
        const prize = Number(task.Prize) || 0;
        const newClicks = Number(clicks) + prize;

        // 3. Обновляем игрока в Strapi
        await updatePlayer(playerId, { clicks: newClicks });

        // 4. Обновляем Zustand
        useMbStore.getState().setMbCountAll(newClicks);

        // 5. Обновляем родительский UI, если нужно
        if (onUpdateClicks) {
          onUpdateClicks(newClicks);
        }

        // 6. Устанавливаем статус вручную
        setClaimedManually(true);
        setState("claimed");
      } catch (err) {
        console.error("Ошибка при выполнении задачи:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🟢 Если задача завершена — показываем галочку
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
