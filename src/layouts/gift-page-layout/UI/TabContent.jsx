import { lazy, useEffect, useState } from "react";
import { fetchBonuses, completeBonusForPlayer } from "../../../services/bonusService";
import { fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";
import BONUS_LINKS from './bonus';
import useMbStore from "../../../store/mb-store";
import PageLoading from "../../../pages/PageLoading";

const BonusButton = lazy(() => import("./Button"));

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

const TabContent = ({ loading, setLoading}) => {
  const { player } = usePlayerData();
  const [bonuses, setBonuses] = useState([]);
  const [error, setError] = useState(false);
  const { mbCountAll, setMbCountAll } = useMbStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bonusData, strapiId] = await Promise.all([
          fetchBonuses(),
          fetchPlayerIdByDocumentId(player.documentId),
        ]);

        const enhanced = bonusData.map((bonus) => {
          const isClaimed = bonus.completedBy?.some((u) => u.id === strapiId);
          return { ...bonus, isClaimed };
        });

        setBonuses(enhanced);
      } catch (err) {
        console.error("Ошибка загрузки бонусов:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (player?.documentId) loadData();
  }, [player?.documentId]);

  const handleComplete = async (bonus) => {
    try {
      await completeBonusForPlayer(player.documentId, bonus.documentId);

      // Начисляем КБ и обновляем игрока
      const newMb = mbCountAll + Number(bonus.Prize);
      setMbCountAll(newMb);

      // Локально помечаем бонус как выполненный
      setBonuses((prev) =>
        prev.map((b) =>
          b.id === bonus.id ? { ...b, isClaimed: true } : b
        )
      );
    } catch (err) {
      console.error("Ошибка при выполнении бонуса:", err);
    }
  };

  if (loading) return <PageLoading loading={loading} />;
  if (error) return <p className="tab-status">Ошибка. Попробуй позже.</p>;
  if (bonuses.length === 0) return <p className="tab-status">Бонусов пока нет</p>;

  return (
    <div className="tabs">
      {bonuses.map((bonus) => {
        const link = getBonusLink(bonus.Name);

        return (
          <div className="task-container" key={bonus.id}>
            <div className="task-info">
              <div className="pfphoto"></div>
              <div className="task-content">
                <p className="task-name">{bonus.Name}</p>
                <p className="task-prize">+ {bonus.Prize} КБ</p>
              </div>
            </div>
              <BonusButton
                bonus={bonus}
                bonusLink={link}
                onComplete={handleComplete}
                isCompleted={bonus.isClaimed}
              />
          </div>
        );
      })}
    </div>
  );
};

export default TabContent;
