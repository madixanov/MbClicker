import { lazy, memo, useEffect } from "react";
import useBonuses from "../../../hooks/useBonuses";
import BONUS_LINKS from "./bonus";
import usePlayerData from "../../../hooks/usePlayerData";
import axios from "axios";

const Button = lazy(() => import('./Button'));

const getBonusLink = (bonusName) => {
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
  const { player } = usePlayerData();

  // ✅ При изменении списка бонусов — добавляем завершённые в player
  useEffect(() => {
    if (!player || !bonuses?.length) return;

    const savedBonusIds = player.bonuses?.map(b => b.documentId) || [];
    console.log("bonuses в player:", player.bonuses);

    const newCompletedBonuses = bonuses.filter(
      (b) => b.Completed && !savedBonusIds.includes(b.documentId)
    );

    if (newCompletedBonuses.length === 0) return;

    const syncBonuses = async () => {
      try {
        await axios.put(`/api/players/${player.documentId}`, {
          bonuses: {
            connect: newCompletedBonuses.map(b => b.documentId),
          },
        });
        console.log("✅ Синхронизированы завершённые бонусы:", newCompletedBonuses.map(b => b.Name));
      } catch (err) {
        console.error("❌ Ошибка при сохранении бонусов:", err);
      }
    };

    syncBonuses();
  }, [bonuses, player]);

  if (loading) return <p>Загрузка бонусов...</p>;
  if (!bonuses.length) return <p>Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus, index) => {
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
              style={{ textDecoration: 'none' }}
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
