import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    console.log("▶️ Проверяем бонус для игрока:", documentId);

    const res = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: "*",
      },
    });

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

    console.log("▶️ Бонус НЕ выдан, но может быть — ищем пригласившего");

    const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: current.invited_by } },
      },
    });

    const inviter = inviterRes.data.data[0];
    if (!inviter) {
      console.warn("❌ Пригласивший не найден по documentId:", current.invited_by);
      return;
    }

    const inviterId = inviter.documentId;

    console.log("✅ Начисляем бонус пригласившему и текущему игроку");

    await axios.put(`${API_BASE_URL}/players/${inviterId}`, {
      data: {
        clicks: (inviter.clicks || 0) + 2500,
      },
    });

    await axios.put(`${API_BASE_URL}/players/${playerId}`, {
      data: {
        clicks: (current.clicks || 0) + 2500,
        referal_bonus_given: true,
      },
    });

    console.log("🎉 Бонус успешно выдан");

    if (onLocalBonus) onLocalBonus();
  } catch (err) {
    console.error("❌ Ошибка при начислении бонусов:", err);
  }
};
