import { lazy, useEffect, useState } from "react";
import { fetchBonuses, completeBonusForPlayer } from "../../../services/bonusService"; // ✅ адаптируй путь
import usePlayerData from "../../../hooks/usePlayerData";
import completed_logo from "../../../assets/icons/completed.svg";
import BONUS_LINKS from './bonus';
import useMbStore from "../../../store/mb-store";
import { updatePlayer } from "../../../services/playerService";

const Button = lazy(() => import("./Button"));

const getBonusLink = (bonusName) => {
  if (typeof bonusName !== "string") return null;

  const nameLower = bonusName.toLowerCase();
  for (const key in BONUS_LINKS) {
    if (nameLower.includes(key)) {
      return BONUS_LINKS[key];
    }
  }
  return null;
};

const TabContent = () => {
  const { player } = usePlayerData(); // ✅ получаем игрока
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState([]);
  const { mbCountAll, setMbCountAll } = useMbStore();

  useEffect(() => {
    const loadBonuses = async () => {
      const bonusesData = await fetchBonuses();
      setBonuses(bonusesData);
      setLoading(false);

      if (player?.completed_bonuses) {
        const ids = player.completed_bonuses.map((b) => b.documentId);
        setCompletedIds(ids);
      }
    };

    loadBonuses();
  }, [player]);

  const handleComplete = async (bonus) => {
    await completeBonusForPlayer(player.documentId, bonus.documentId);
    setCompletedIds((prev) => [...prev, bonus.documentId]);
    const newCount = mbCountAll + Number(bonus.Prize);
    setMbCountAll(newCount);
    updatePlayer(player.documentId, newCount)
  };

  if (loading) return <p className="tab-status">Загрузка бонусов...</p>;
  if (!Array.isArray(bonuses) || bonuses.length === 0)
    return <p className="tab-status">Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus) => {
        const isCompleted = completedIds.includes(bonus.documentId);
        const link = getBonusLink(bonus.Name);

        return (
          <div className="task-container" key={bonus.documentId}>
            <div className="pfphoto"></div>
            <div className="task-content">
              <p className="task-name">{bonus.Name}</p>
              <p className="task-prize">+ {bonus.Prize} КБ</p>
            </div>

            {isCompleted ? (
              <div className="task-completed">
                <img
                  src={completed_logo}
                  alt="Бонус получен"
                  className="completed-icon"
                />
              </div>
            ) : (
              <Button
                bonus={bonus}
                bonusLink={link}
                onComplete={handleComplete}
                isCompleted={isCompleted}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabContent;
