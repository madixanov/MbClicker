import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    console.log("🔍 Начинаем обработку реферального бонуса...");
    console.log("🆔 ID текущего игрока:", documentId);

    // Получаем текущего игрока по documentId
    const playerRes = await axios.get(`${API_BASE_URL}/api/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: "*",
      },
    });

    const currentRaw = playerRes.data.data[0];
    if (!currentRaw) {
      console.warn("❌ Игрок не найден");
      return;
    }

    const current = currentRaw;
    const currentId = current.documentId;
    const currentData = current;

    if (currentData.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    const inviterRaw = currentData.invited_by?.data;
    if (!inviterRaw) {
      console.warn("❌ У игрока нет пригласившего");
      return;
    }

    const inviterId = inviterRaw.documentId;
    const inviterData = inviterRaw

    const inviterClicks = Number(inviterData.clicks) || 0;
    const currentClicks = Number(currentData.clicks) || 0;

    // 1. Обновляем пригласившего
    await axios.put(`${API_BASE_URL}/api/players/${inviterId}`, {
      data: {
        clicks: inviterClicks + 2500,
      },
    });

    // 2. Обновляем текущего игрока
    await axios.put(`${API_BASE_URL}/api/players/${currentId}`, {
      data: {
        clicks: currentClicks + 2500,
        referal_bonus_given: true,
      },
    });

    console.log("🎉 Бонус выдан обоим: +2500");

    // 3. Локальное обновление
    if (typeof onLocalBonus === "function") {
      onLocalBonus(); // Например: setMbCountAll(prev => prev + 2500)
    }

    // Успешно завершено
    return true;

  } catch (err) {
    console.error("❌ Ошибка в referralBonus:", err);
    if (err.response) console.error("💥 Ответ сервера:", err.response.data);
    return false;
  }
};
