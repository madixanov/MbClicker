import { useEffect, useRef } from "react";
import usePlayerStore from "../store/player-store";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  updatePlayerWithFallback,
} from "../services/playerService";

const useReferralBonus = () => {
  const { player, setPlayer } = usePlayerStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processBonus = async () => {
      if (hasProcessed.current || !player) return;
      hasProcessed.current = true;

      try {
        // Обновим данные игрока из Strapi (на всякий случай)
        const currentPlayer = await fetchPlayerByTelegramId(player.telegram_id);
        if (!currentPlayer) return;

        const invitedBy = currentPlayer.invited_by;
        const received = currentPlayer.referral_bonus_received;

        // 🎁 Бонус приглашённому
        if (invitedBy && !received) {
          await updatePlayerWithFallback(currentPlayer.documentId, {
            referral_bonus_received: true,
            mbCountAll: (currentPlayer.mbCountAll || 0) + 2500,
          });
          console.log("🎉 Бонус приглашённому выдан");
        }

        // 🎁 Бонус пригласившему
        if (invitedBy && !invitedBy.bonus_given) {
          await updatePlayerWithFallback(invitedBy.documentId, {
            bonus_given: true,
            mbCountAll: (invitedBy.mbCountAll || 0) + 10000,
          });
          console.log("🎁 Бонус пригласителю выдан");
        }

        // Обновим игрока в store
        const updatedPlayer = await fetchPlayerByTelegramId(player.telegram_id);
        if (updatedPlayer) {
          setPlayer(updatedPlayer);
        }
      } catch (err) {
        console.error("❌ Ошибка при выдаче бонусов:", err);
      }
    };

    processBonus();
  }, [player, setPlayer]);
};

export default useReferralBonus;
