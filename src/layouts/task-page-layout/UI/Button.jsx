import { useState, useEffect } from "react";
import {
  completeTask,
  // fetchPlayerIdByDocumentId ❌ — убираем
} from "../../../services/taskService";
import { updatePlayer } from "../../../services/playerService";
import completed from "../../../assets/icons/completed.svg";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";

const Button = ({
  task,
  clicks,
  playerId,
  strapiPlayerId,     // ✅ теперь получаем готовый ID
  isClaimed,          // ✅ передаём, выполнена ли задача
  onUpdateClicks,
  onReady,
}) => {
  const [state, setState] = useState("initial");
  const [loading, setLoading] = useState(false);
  const [claimedManually, setClaimedManually] = useState(false);

  const [progressValue, setProgressValue] = useState(0);
  const isLevelTask = task.Name.includes("LVL");

  const mbStore = useMbStore();
  const lvlStore = useLvlStore();

  // 1. Подписка на изменения в состоянии
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
    setProgressValue(
      isLevelTask ? lvlStore.level || 0 : mbStore.mbCountAll || 0
    );

    return () => {
      unsubscribeMb();
      unsubscribeLvl();
    };
  }, [isLevelTask]);

  // 2. Проверка — задача уже завершена?
  useEffect(() => {
    if (isClaimed || claimedManually) {
      setState("claimed");
    }
    if (onReady) onReady(); // ✅ сигнал, что кнопка готова
  }, [isClaimed, claimedManually, onReady]);

  // 3. Обработка клика
  const handleClick = async () => {
    if (loading || !strapiPlayerId) return;

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

  // 4. UI
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
