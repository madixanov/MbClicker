import { lazy, memo } from "react";
import useBonuses from "../../../hooks/useBonuses";
import BONUS_LINKS from "./bonus";

const Button = lazy(() => import("./Button"));

const getBonusLink = (bonusName) => {
  if (!bonusName || typeof bonusName !== "string") return null;

  const nameLower = bonusName.toLowerCase();
  for (const key in BONUS_LINKS) {
    if (nameLower.includes(key)) {
      return BONUS_LINKS[key];
    }
  }
  return null;
};

const TabContent = () => {
  const { bonuses, loading } = useBonuses();

  if (loading) return <p>Загрузка бонусов...</p>;
  if (!Array.isArray(bonuses) || !bonuses.length) return <p>Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses
        .filter((bonus) => bonus?.Name) // Отфильтровать только с Name
        .map((bonus, index) => {
          const bonusLink = getBonusLink(bonus.Name);

          return (
            <div className="task-container" key={index}>
              <div className="pfphoto"></div>
              <div className="task-content">
                <p className="task-name">{bonus.Name}</p>
                <p className="task-prize">+ {bonus.Prize} B</p>
              </div>
              <a
                href={bonusLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button completed={bonus.Completed} />
              </a>
            </div>
          );
        })}
    </div>
  );
};

export default memo(TabContent);
