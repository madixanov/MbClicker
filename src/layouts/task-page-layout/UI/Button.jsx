import { useState, useEffect } from "react";
import {
  completeTask,
  fetchPlayerIdByDocumentId,
} from "../../../services/taskService";
import { updatePlayer } from "../../../services/playerService";
import completed from "../../../assets/icons/completed.svg";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";

const Button = ({ task, clicks, playerId, onUpdateClicks }) => {
  const [realPlayerId, setRealPlayerId] = useState(null);
  const [state, setState] = useState("initial");
  const [loading, setLoading] = useState(false);
  const [claimedManually, setClaimedManually] = useState(false);

  const [progressValue, setProgressValue] = useState(0);
  const isLevelTask = task.Name.includes("LVL");

  const mbStore = useMbStore();
  const lvlStore = useLvlStore();

  // 1. Прогресс задачи (автообновление при изменении Zustand)
  useEffect(() => {
    const unsubscribeMb = useMbStore.subscribe(
      (state) => state.mbCountAll,
      (mbCountAll) => {
        if (!isLevelTask) setProgressValue(mbCountAll);
      }
    );
    const unsubscribeLvl = useLvlStore.subscribe(
      (state) => state.level,
      (level) => {
        if (isLevelTask) setProgressValue(level);
      }
    );

    // начальное значение
    if (isLevelTask) setProgressValue(lvlStore.level || 0);
    else setProgressValue(mbStore.mbCountAll || 0);

    return () => {
      unsubscribeMb();
      unsubscribeLvl();
    };
  }, [isLevelTask]);

  // 2. Получаем реальные Strapi ID игрока
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

  // 3. Проверка: выполнена ли задача?
  useEffect(() => {
    if (!realPlayerId || !task.completedBy || state === "claimed" || claimedManually) return;

    const alreadyCompleted = task.completedBy.some(
      (user) => user.id === realPlayerId
    );

    if (alreadyCompleted) {
      setState("claimed");
    }
  }, [realPlayerId, task.completedBy, state, claimedManually]);

  // 4. Обработка клика
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
        await completeTask(task.documentId, playerId);

        const prize = Number(task.Prize) || 0;
        const newClicks = Number(clicks) + prize;

        await updatePlayer(playerId, { clicks: newClicks });
        mbStore.setMbCountAll(newClicks);

        if (onUpdateClicks) onUpdateClicks(newClicks);

        setClaimedManually(true);
        setState("claimed");
      } catch (err) {
        console.error("Ошибка при выполнении задачи:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 5. UI: выполнено
  if (state === "claimed") {
    return (
      <span className="task-done">
        <img src={completed} alt="Выполнено" />
      </span>
    );
  }

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
