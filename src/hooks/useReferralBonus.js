import axios from "axios";
import { API_BASE_URL } from "../config/api";

// Если у тебя аргумент — это telegramId, то:

export const referralBonus = async (telegramId, onLocalBonus) => {
  if (!telegramId) {
    console.warn("❌ Нет telegramId — бонус не проверяется");
    return;
  }

  try {
    console.log("▶️ Проверяем бонус для игрока:", telegramId);

    // Ищем игрока по telegram_id
    const res = await axios.get(`${API_BASE_URL}/players`, {
        filters: { telegram_id: { $eq: telegramId } },
        populate: "*",
      },);

    const current = res.data.data[0];
    if (!current) {
      console.warn("❌ Игрок не найден в базе");
      return;
    }

    console.log("✅ Игрок найден:", current);

    const playerId = current.documentId;

    if (!current.invited_by) {
      console.warn("❌ invited_by отсутствует — бонус не будет выдан");
      return;
    }

    if (current.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    console.log("▶️ Бонус НЕ выдан, ищем пригласившего");

    // Ищем пригласившего по telegram_id
    const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
        filters: { telegram_id: { $eq: current.invited_by } },
    });

    const inviter = inviterRes.data.data[0];
    if (!inviter) {
      console.warn("❌ Пригласивший не найден по telegram_id:", current.invited_by);
      return;
    }

    const inviterId = inviter.documentId;

    console.log("✅ Начисляем бонус пригласившему и текущему игроку");

    await axios.put(`${API_BASE_URL}/players/${inviterId}`, {
        clicks: (inviter.clicks || 0) + 2500,
    });

    await axios.put(`${API_BASE_URL}/players/${playerId}`, {

        clicks: (current.clicks || 0) + 2500,
        referal_bonus_given: true,
    });

    console.log("🎉 Бонус успешно выдан");

    if (onLocalBonus) onLocalBonus();
  } catch (err) {
    console.error("❌ Ошибка при начислении бонусов:", err);
  }
};

