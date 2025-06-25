import { lazy, memo } from "react";
import useBonuses from "../../../hooks/useBonuses";
import BONUS_LINKS from "./bonus";

const Button = lazy(() => import("./Button"));

const getBonusLink = (bonusName) => {
  if (typeof bonusName !== "string") return null; // 💥 защита от undefined/null

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

    bonuses.forEach((bonus) => {
    if (!bonus.Name) {
        console.warn("⚠️ У бонуса нет Name:", bonus);
        }
    });

  return (
    <div className="tabs">
      {bonuses.map((bonus, index) => {
        const bonusLink = getBonusLink(bonus.Name);

        return (
          <div className="task-container" key={index}>
            <div className="pfphoto"></div>
            <div className="task-content">
              <p className="task-name">{bonus.Name}</p>
              <p className="task-prize">+ {bonus.Prize} Bytes</p>
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
