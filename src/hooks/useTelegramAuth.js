import { useEffect, useRef } from "react";
import usePlayerStore from "../store/player-store";
import useMbStore from "../store/mb-store";
import {
  fetchPlayerByTelegramId,
  updatePlayerWithFallback,
} from "../services/playerService";

const useReferralBonus = () => {
  const { player, setPlayer } = usePlayerStore();
  const { setMbCountAll } = useMbStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processBonus = async () => {
      if (hasProcessed.current || !player) return;
      hasProcessed.current = true;

      try {
        const freshPlayer = await fetchPlayerByTelegramId(player.telegram_id);
        if (!freshPlayer) return;

        const {
          documentId,
          invited_by,
          invited_friends = [],
          referral_bonus_received,
          referral_friends_bonus_given,
          clicks,
        } = freshPlayer;

        let updatedClicks = clicks ?? 0;
        let localUpdate = false;

        // 🎁 Бонус приглашённому (если он перешёл по чьей-то ссылке)
        if (invited_by && !referral_bonus_received) {
          updatedClicks += 2500;
          await updatePlayerWithFallback(documentId, {
            referral_bonus_received: true,
            clicks: updatedClicks,
          });
          console.log("🎉 Бонус приглашённому выдан");
          localUpdate = true;
        }

        // 🎁 Бонус за приглашённых друзей (по 2500 за каждого)
        if (invited_friends.length > 0 && !referral_friends_bonus_given) {
          const bonusTotal = invited_friends.length * 2500;
          updatedClicks += bonusTotal;

          await updatePlayerWithFallback(documentId, {
            referral_friends_bonus_given: true,
            clicks: updatedClicks,
          });

          console.log(`🎉 Бонус за ${invited_friends.length} друга(ей): +${bonusTotal}`);
          localUpdate = true;
        }

        // 🎁 Бонус пригласителю (если ещё не выдан)
        if (invited_by && !invited_by.bonus_given) {
          const inviterClicks = invited_by.clicks ?? 0;
          await updatePlayerWithFallback(invited_by.documentId, {
            bonus_given: true,
            clicks: inviterClicks + 10000,
          });
          console.log("🎁 Бонус пригласителю выдан");
        }

        // ✅ Обновление локального Zustand
        if (localUpdate) {
          setMbCountAll(updatedClicks);

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
