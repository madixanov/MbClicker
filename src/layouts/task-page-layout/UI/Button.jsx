import { useState, useEffect } from "react";
import { completeTask } from "../../../services/taskService";
import completed from "../../../assets/icons/completed.svg";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";
import useTaskInteractionStore from "../../../store/taskInteractionStore";

const Button = ({
  task,
  playerId,
  isClaimed,
  onUpdateClicks,
  onReady,
}) => {
  const [state, setState] = useState("initial");
  const [claimedManually, setClaimedManually] = useState(false);

  const isLevelTask = task.Name.includes("LVL");

  const mbStore = useMbStore();
  const lvlStore = useLvlStore();
  const { isProcessing, setIsProcessing } = useTaskInteractionStore();

  const [progressValue, setProgressValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Подписка на изменения прогресса
  useEffect(() => {
    const unsubMb = useMbStore.subscribe(
      (state) => state.mbCountAll,
      (val) => {
        if (!isLevelTask) setProgressValue(val);
      }
    );
    const unsubLvl = useLvlStore.subscribe(
      (state) => state.level,
      (val) => {
        if (isLevelTask) setProgressValue(val);
      }
    );

    setProgressValue(isLevelTask ? lvlStore.level || 0 : mbStore.mbCountAll || 0);

    return () => {
      unsubMb();
      unsubLvl();
    };
  }, [isLevelTask]);

  // Проверка выполненности задачи
  useEffect(() => {
    if (isClaimed || claimedManually) {
      setState("claimed");
    }
    if (onReady) onReady();
  }, [isClaimed, claimedManually, onReady]);

  // Обработка клика
  const handleClick = async () => {
    if (loading || isProcessing || state === "claimed") return;

    if (state === "initial") {
      const ready = progressValue >= task.Goal;
      if (ready) {
        setState("ready");
      } else {
        alert("Вы ещё не выполнили задание.");
      }
    } else if (state === "ready") {
      setLoading(true);
      setIsProcessing(true);
      try {
        await completeTask(task.documentId, playerId);

        const prize = Number(task.Prize) || 0;
        mbStore.setMbCountAll(prize); // ✅ прибавляем к mbCountAll

        if (onUpdateClicks) onUpdateClicks(mbStore.mbCountAll + prize);

        setClaimedManually(true);
        setState("claimed");
      } catch (err) {
        console.error("Ошибка при завершении задачи:", err);
      } finally {
        setIsProcessing(false);
        setLoading(false);
      }
    }
  };

  // UI
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
      disabled={loading || isProcessing}
    >
      {loading || isProcessing
        ? "..."
        : state === "ready"
        ? "ПОЛУЧИТЬ"
        : "ВЫПОЛНИТЬ"}
    </button>
  );
};

export default Button;
