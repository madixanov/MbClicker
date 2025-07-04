import { updatePlayer } from "../services/playerService";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "../services/playerService";

export const completeBonus = async (bonusId) => {
  const user = getTelegramUser();
  if (!user) return;

  const player = await fetchPlayerByTelegramId(user.id);
  if (!player) return;

  const { completed_bonuses = [] } = player;

  if (completed_bonuses.includes(bonusId)) return;

  const updateBonuses = [ ...completed_bonuses, bonusId];

  await updatePlayer(player.documentId, {
    completed_bonuses: updateBonuses
  })
}