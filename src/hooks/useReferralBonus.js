import { useEffect } from "react";
import usePlayerStore from "../store/player-store";
import { updatePlayer } from "../services/playerService";

const useReferralBonus = () => {
  const { player, setMbCountAll, setPlayer } = usePlayerStore();

  useEffect(() => {
    if (!player) return;

    let bonus = 0;
    const updatedFields = {};

    // 🎁 Бонус за приглашение (invited_by)
    if (player.invited_by && !player.bonus_given) {
      bonus += 2500;
      updatedFields.bonus_given = true;
    }

    // 🎁 Бонус за друзей
    const alreadyBonusedIds = player.bonused_friend_ids || [];
    const invitedFriends = player.invited_friends || [];

    const newFriends = invitedFriends.filter((friend) => {
      const friendId = friend.telegram_id || friend.documentId;
      return !alreadyBonusedIds.includes(friendId);
    });

    if (newFriends.length > 0) {
      bonus += 2500 * newFriends.length;

      const newBonusedIds = [
        ...alreadyBonusedIds,
        ...newFriends.map((f) => f.telegram_id || f.documentId),
      ];

      updatedFields.bonused_friend_ids = newBonusedIds;
    }

    // ✅ Применить бонус и сохранить изменения в Strapi
    if (bonus > 0) {
      setMbCountAll((prev) => prev + bonus);

      updatePlayer(player.documentId, updatedFields)
        .then(() => {
          setPlayer({ ...player, ...updatedFields });
        })
        .catch((err) => {
          console.error("Ошибка при обновлении игрока:", err);
        });
    }
  }, [player]);
};

export default useReferralBonus;
