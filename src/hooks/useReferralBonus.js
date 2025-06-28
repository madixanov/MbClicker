import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus, mbCountAll) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    console.log("▶️ Ищем игрока с documentId:", documentId);

    // Запрос с фильтром и populate invited_by для relation
    const res = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: '*', // или "*" если хочешь все поля // на всякий случай лимит
      },
    });

    console.log("📥 Ответ API (поиск игрока):", JSON.stringify(res.data, null, 2));

    if (!res.data.data.length) {
      console.warn("❌ Игрок НЕ найден в базе");
      return;
    }

    const current = res.data.data[0];

    console.log("✅ Игрок найден:", current);

    if (!current.invited_by) {
      console.warn("❌ invited_by отсутствует — бонус не будет выдан");
      return;
    }

    if (current.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    const inviterDocumentId = current.invited_by.documentId;

    console.log("▶️ Ищем пригласившего по documentId:", inviterDocumentId);

    if (!inviterDocumentId) {
      console.warn("❌ В invited_by нет documentId");
      return;
    }

    const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: inviterDocumentId } },
        populate: "*",
      },
    });

    console.log("📥 Ответ API (поиск пригласившего):", JSON.stringify(inviterRes.data, null, 2));

    if (!inviterRes.data.data.length) {
      console.warn("❌ Пригласивший не найден");
      return;
    }

    const inviter = inviterRes.data.data[0];

    // Проконтролируй поля clicks у current и inviter
    const currentClicks = Number(current.clicks) || 0;
    const inviterClicks = Number(inviter.clicks) || 0;

    console.log(`Текущий кликов у игрока: ${currentClicks}, у пригласившего: ${inviterClicks}`);

    const inviterId = inviter.documentId;
    const playerId = current.documentId;

    console.log("✅ Начисляем бонусы");

    // Обновляем пригласившего
    await axios.put(`${API_BASE_URL}/players/${inviterId}`, {
      data: {
        clicks: inviterClicks + 2500,
      },
    });

    // Обновляем текущего игрока
    await axios.put(`${API_BASE_URL}/players/${playerId}`, {
      data: {
        clicks: currentClicks + 2500,
        referal_bonus_given: true,
      },
    });

    console.log("🎉 Бонусы успешно выданы");

    if (typeof onLocalBonus === "function") {
      onLocalBonus();
    }

  } catch (err) {
    console.error("❌ Ошибка в referralBonusDebug:", err);
  }
};
