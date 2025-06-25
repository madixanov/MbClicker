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
  const [realTaskId, setRealTaskId] = useState(null);
  const [state, setState] = useState("initial"); // initial → ready → claimed
  const [loading, setLoading] = useState(false);
  const [claimedManually, setClaimedManually] = useState(false); // 🆕 защита от отката

  const isLevelTask = task.Name.includes("LVL");
  const progressValue = isLevelTask ? level : clicks;

  // 📌 1. Получаем реальные ID из Strapi
  useEffect(() => {
    const init = async () => {
      try {
        const strapiPlayerId = await fetchPlayerIdByDocumentId(playerId);
        const strapiTaskId = await fetchTaskIdByDocumentId(task.documentId);
        setRealPlayerId(strapiPlayerId);
        setRealTaskId(strapiTaskId);
      } catch (err) {
        console.error("Ошибка при инициализации кнопки:", err);
      }
    };
    init();
  }, [playerId, task.documentId]);

  // 📌 2. Проверка: выполнена ли задача (после загрузки ID)
  useEffect(() => {
    if (!realPlayerId || !task.completedBy || state === "claimed" || claimedManually) return;

    const alreadyCompleted = task.completedBy.some(
      (user) => user.id === realPlayerId
    );

    if (alreadyCompleted) {
      setState("claimed");
    }
  }, [realPlayerId, task.completedBy, state, claimedManually]);

  // 📌 3. Обработка клика
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
        // ✅ Завершаем задачу
        await completeTask(task.documentId, playerId);

        // ✅ Выдаём награду
        const prize = Number(task.Prize) || 0;
        const newClicks = Number(clicks) + prize;

        await updatePlayer(playerId, {
          clicks: newClicks,
        });

        // ✅ Сохраняем в Zustand
        useMbStore.getState().setMbCountAll(newClicks);

        // ✅ Обновляем UI вручную
        if (onUpdateClicks) {
          onUpdateClicks(newClicks);
        }

        setClaimedManually(true); // 🆕 Блокируем откат
        setState("claimed");      // 🎉 Показать галочку
      } catch (err) {
        console.error("Ошибка при выполнении задачи:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Если задача выполнена — галочка
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
