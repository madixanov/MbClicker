import { useState, useEffect } from "react";
import { completeBonus } from "../../../hooks/useBonusCompletionSync";
import { updatePlayer } from "../../../services/playerService";
import usePlayerData from "../../../hooks/usePlayerData";
import useMbStore from "../../../store/mb-store";
import completed_logo from "../../../assets/icons/completed.svg"

const BonusButton = ({ completed, bonusUrl, bonus, player }) => {
  const [status, setStatus] = useState("idle");
  const { setPlayer } = usePlayerData();
  const { mbCountAll, setMbCountAll } = useMbStore();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (status === "waiting" && document.visibilityState === "visible") {
        giveBonus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status]);

  const onBonusClaimed = async (bonus) => {
    if (!player || !bonus.document) return;

    await completeBonus(bonus.documentId);
    const newCount = mbCountAll + bonus.prize
    setMbCountAll(newCount);
    await updatePlayer(player.documentId, {
      clicks: mbCountAll
    })

    setPlayer((prev) => ({
      ...prev,
      completed_bonuses: [...(prev.completed_bonuses || []), bonus.documentId],
    }));
  }

  const giveBonus = async () => {
    if (status === "done") return;

    setStatus("done");
    if (onBonusClaimed) {
      await onBonusClaimed(bonus.documentId);
    }
  };

  const handleClick = () => {
    if (status !== "idle") return;

    setStatus("checking");

    window.open(bonusUrl, "_blank");

    setTimeout(() => {
      if (document.visibilityState === "visible") {
        giveBonus();
      } else {
        setStatus("waiting");
      }
    }, 5000);
  };

  const getLabel = () => {
    if (completed || status === "done") return "ПОЛУЧИТЬ";
    if (status === "checking") return "ПРОВЕРКА";
    if (status === "waiting") return "ВОЗВРАТ...";
    return "ВЫПОЛНИТЬ";
  };

  return completed || status === "done" ? (
    <div className="task-completed">
      <img
        src={completed_logo}
        alt="Бонус получен"
        className="completed-icon"
      />
    </div>
  ) : (
    <button
      aria-label={getLabel()}
      onClick={handleClick}
      className={`task-btn ${status === "checking" || status === "waiting" ? "active-btn" : ""}`}
    >
      {getLabel()}
    </button>
);

};

export default BonusButton;
