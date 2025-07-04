import { lazy, useEffect, useState } from "react";
import { fetchBonuses } from "../../../services/bonusService"; // 👈 адаптируй путь
import { fetchPlayerIdByDocumentId } from '../../../services/taskService'
import usePlayerData from "../../../hooks/usePlayerData";
import completed_logo from "../../../assets/icons/completed.svg";
import BONUS_LINKS from './bonus'

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
  const [bonuses, setBonuses] = useState([]);
  const [playerStrapiId, setPlayerStrapiId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { player } = usePlayerData();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bonusData, strapiId] = await Promise.all([
          fetchBonuses(),
          fetchPlayerIdByDocumentId(player.documentId),
        ]);

        const enhancedBonuses = bonusData.map((bonus) => {
          const isClaimed = bonus.completedBy?.some(
            (user) => user.id === strapiId
          );
          return { ...bonus, isClaimed };
        });

        setBonuses(enhancedBonuses);
        setPlayerStrapiId(strapiId);
      } catch (err) {
        console.error("Ошибка при загрузке бонусов или игрока:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (player?.documentId) {
      loadData();
    }
  }, [player?.documentId]);

  if (loading) return <p className="tab-status">Загрузка бонусов...</p>;
  if (error) return <p className="tab-status">Произошла ошибка. Пока нет бонусов.</p>;
  if (!Array.isArray(bonuses) || bonuses.length === 0)
    return <p className="tab-status">Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus) => (
        <div className="task-container" key={bonus.id}>
          <div className="pfphoto"></div>
          <div className="task-content">
            <p className="task-name">{bonus.Name}</p>
            <p className="task-prize">+ {bonus.Prize} КБ</p>
          </div>

          {bonus.isClaimed ? (
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
              bonusUrl={getBonusLink(bonus.Name)} // адаптируй если ссылка приходит по-другому
              player={player}
              strapiPlayerId={playerStrapiId}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TabContent;
