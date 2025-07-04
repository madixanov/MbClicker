import { lazy, memo } from "react";
import useBonuses from "../../../hooks/useBonuses";
import BONUS_LINKS from "./bonus";
import usePlayerData from '../../../hooks/usePlayerData'

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
  const { player } = usePlayerData();
  const { bonuses, loading, error } = useBonuses();
  const completedBonuses = player?.completed_bonuses || [];

  if (loading) return <p className="tab-status">Загрузка бонусов...</p>;
  if (error) return <p className="tab-status">Произошла ошибка. Пока нет бонусов.</p>;
  if (!Array.isArray(bonuses) || bonuses.length === 0)
    return <p className="tab-status">Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus, index) => {
        const bonusData = bonus.attributes || bonus;
        const bonusId = bonus.documentId;
        const bonusLink = getBonusLink(bonusData.Name);
        const isCompleted = completedBonuses.includes(bonusId);

        return (
          <div className="task-container" key={bonusId || index}>
            <div className="pfphoto"></div>
            <div className="task-content">
              <p className="task-name">{bonusData.Name}</p>
              <p className="task-prize">+ {bonusData.Prize} КБ</p>
            </div>

            <Button
              bonus={bonus}
              bonusUrl={bonusLink}
              completed={isCompleted}
              player={player}
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(TabContent);
