import { lazy, memo } from "react";
import useBonuses from "../../../hooks/useBonuses";
import BONUS_LINKS from "./bonus";

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
  const { bonuses, loading, error } = useBonuses();

  if (loading) return <p className="tab-status">Загрузка бонусов...</p>;
  if (error) return <p className="tab-status">Произошла ошибка. Пока нет бонусов.</p>;
  if (!Array.isArray(bonuses) || bonuses.length === 0)
    return <p className="tab-status">Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus, index) => {
        const bonusData = bonus.attributes || bonus; // поддержка Strapi 4 и 5
        const bonusLink = getBonusLink(bonusData.Name);

        return (
          <div className="task-container" key={bonus.documentId || index}>
            <div className="pfphoto"></div>
            <div className="task-content">
              <p className="task-name">{bonusData.Name}</p>
              <p className="task-prize">+ {bonusData.Prize} КБ</p>
            </div>
            <a
              href={bonusLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button completed={bonusData.Completed} />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TabContent);
