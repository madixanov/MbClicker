// hooks/useBonusCompletionSync.js
import { useEffect } from "react";
import axios from "axios";

const useBonusCompletionSync = (bonuses, player) => {
  useEffect(() => {
    if (!player || !bonuses?.length) return;

    const syncCompletedBonuses = async () => {
      const savedBonusIds = player.bonuses?.map((b) => b.documentId) || [];

      const newCompletedBonuses = bonuses.filter(
        (bonus) => bonus.isCompleted && !savedBonusIds.includes(bonus.documentId)
      );

      if (newCompletedBonuses.length === 0) return;

      try {
        await axios.put(`/api/players/${player.documentId}`, {
          bonuses: {
            connect: newCompletedBonuses.map((b) => b.documentId),
          },
        });

        console.log("✅ Добавлены бонусы игроку:", newCompletedBonuses.map(b => b.title));
      } catch (err) {
        console.error("❌ Ошибка при добавлении бонусов в player:", err);
      }
    };

    syncCompletedBonuses();
  }, [bonuses, player]);
};

export default useBonusCompletionSync;
