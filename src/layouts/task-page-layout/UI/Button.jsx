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

  useEffect(() => {
    if (isClaimed || claimedManually) {
      setState("claimed");
    }
    if (onReady) onReady();
  }, [isClaimed, claimedManually, onReady]);

  const handleClick = async () => {
    if (loading || isProcessing || state === "claimed") return;

    const ready = progressValue >= task.Goal;

    if (task.taskLink) {
      window.open(task.taskLink, "_blank");

      const handleVisibility = async () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", handleVisibility);

          if (!ready) {
            alert("Вы ещё не выполнили задание.");
            return;
          }

          setLoading(true);
          setIsProcessing(true);
          try {
            await completeTask(task.documentId, playerId);

            const prize = Number(task.Prize) || 0;
            const newClicks = mbStore.mbCountAll + prize;
            mbStore.setMbCountAll(newClicks);

            if (onUpdateClicks) onUpdateClicks(newClicks);

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

      document.addEventListener("visibilitychange", handleVisibility);
    } else {
      if (state === "initial") {
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
          const newClicks = mbStore.mbCountAll + prize;
          mbStore.setMbCountAll(newClicks);

          if (onUpdateClicks) onUpdateClicks(newClicks);

          setClaimedManually(true);
          setState("claimed");
        } catch (err) {
          console.error("Ошибка при завершении задачи:", err);
        } finally {
          setIsProcessing(false);
          setLoading(false);
        }
      }
    }
  };

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
        ? "ВЫДАЧА"
        : state === "ready"
        ? "ПОЛУЧИТЬ"
        : "ВЫПОЛНИТЬ"}
    </button>
  );
};

export default Button;
