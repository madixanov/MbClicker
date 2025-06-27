import { useEffect, useRef } from "react";
import usePlayerStore from "../store/player-store";
import useMbStore from "../store/mb-store";
import {
  fetchPlayerByTelegramId,
  updatePlayerWithFallback,
} from "../services/playerService";

const useReferralBonus = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setMbCountAll, mbCountAll } = useMbStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processBonus = async () => {
      if (hasProcessed.current || !player) return;
      hasProcessed.current = true;

      try {
        const freshPlayer = await fetchPlayerByTelegramId(player.telegram_id);
        if (!freshPlayer) return;

        const { documentId, invited_by, referral_bonus_given, clicks} = freshPlayer;
        let localUpdate = false;

        // 🎁 Бонус для приглашённого
        if (invited_by && !referral_bonus_given) {

          // Обновляем только флаг в Strapi
          await updatePlayerWithFallback(documentId, {
            referral_bonus_given: true,
            clicks: clicks + 2500
          });

          // Обновляем локально mbCountAll

          console.log("🎉 Бонус приглашённому выдан");
        }

        // 🎁 Бонус для пригласившего
        if (invited_by && !invited_by.bonus_given) {
          await updatePlayerWithFallback(invited_by.documentId, {
            bonus_given: true,
          });
          setMbCountAll(mbCountAll + 2500);

          console.log("🎁 Бонус пригласителю выдан");
        }

        if (localUpdate) {
          const updated = await fetchPlayerByTelegramId(player.telegram_id);
          if (updated) {
            setPlayer(updated);
          }
        }

      } catch (err) {
        console.error("❌ Ошибка при выдаче бонусов:", err);
      }
    };

    processBonus();
  }, [player, setPlayer, setMbCountAll]);
};

export default useReferralBonus;
