import { useState, useEffect } from "react";
import { completeBonus } from "../../../hooks/useBonusCompletionSync";
import { updatePlayer } from "../../../services/playerService";
import completed from "../../../assets/icons/completed.svg";
import useMbStore from "../../../store/mb-store";
import usePlayerData from "../../../hooks/usePlayerData";
import useTaskInteractionStore from "../../../store/taskInteractionStore";

const BonusButton = ({
  bonus,
  bonusUrl,
  player,
  isClaimed,
}) => {
  const [state, setState] = useState("initial"); // initial | waiting | checking | claimed
  const [loading, setLoading] = useState(false);
  const [claimedManually, setClaimedManually] = useState(false);

  const { mbCountAll, setMbCountAll } = useMbStore();
  const { setPlayer } = usePlayerData();
  const { isProcessing, setIsProcessing } = useTaskInteractionStore();

  useEffect(() => {
    const unsub = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    if (state === "waiting") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return unsub;
  }, [state]);

  useEffect(() => {
    if (isClaimed || claimedManually) {
      setState("claimed");
    }
  }, [isClaimed, claimedManually]);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      giveBonus();
    }
  };

  const giveBonus = async () => {
    if (state === "claimed" || loading || isProcessing) return;

    setLoading(true);
    setIsProcessing(true);

    try {
      await completeBonus(bonus.documentId);

      const prize = Number(bonus.Prize) || 0;
      const newCount = mbCountAll + prize;

      setMbCountAll(newCount);

      await updatePlayer(player.documentId, {
        clicks: newCount,
      });

      setPlayer((prev) => ({
        ...prev,
        completed_bonuses: [...(prev.completed_bonuses || []), bonus.documentId],
      }));

      setClaimedManually(true);
      setState("claimed");
    } catch (err) {
      console.error("Ошибка при выдаче бонуса:", err);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (loading || isProcessing || state !== "initial") return;

    setState("checking");
    window.open(bonusUrl, "_blank");

    setTimeout(() => {
      if (document.visibilityState === "visible") {
        giveBonus();
      } else {
        setState("waiting");
      }
    }, 5000);
  };

  // UI
  if (state === "claimed") {
    return (
      <span className="task-done">
        <img src={completed} alt="Бонус получен" />
      </span>
    );
  }

  return (
    <button
      className={`task-btn ${state === "checking" || state === "waiting" ? "active" : ""}`}
      onClick={handleClick}
      disabled={loading || isProcessing}
    >
      {loading || isProcessing
        ? "..."
        : state === "waiting"
        ? "ВОЗВРАТ..."
        : state === "checking"
        ? "ПРОВЕРКА"
        : "ВЫПОЛНИТЬ"}
    </button>
  );
};

export default BonusButton;
