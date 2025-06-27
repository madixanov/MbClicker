import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    console.log("▶️ Ищем игрока с documentId:", documentId);

    // Получаем игрока с фильтром и populate invited_by
    const res = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: "*",
      },
    });

    console.log("📥 Ответ API (поиск игрока):", JSON.stringify(res.data, null, 2));

    if (!res.data.data.length) {
      console.warn("❌ Игрок НЕ найден в базе");
      return;
    }

    const current = res.data.data[0];

    console.log("✅ Игрок найден:", current);

    // Проверяем есть ли inviter
    if (!current.attributes.invited_by || !current.attributes.invited_by.data) {
      console.warn("❌ invited_by отсутствует — бонус не будет выдан");
      return;
    }

    if (current.attributes.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    const inviterData = current.attributes.invited_by.data;
    const inviterDocumentId = inviterData.attributes.documentId;

    console.log("▶️ Ищем пригласившего по documentId:", inviterDocumentId);

    if (!inviterDocumentId) {
      console.warn("❌ В invited_by нет documentId");
      return;
    }

    // Получаем пригласившего
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

    // Получаем clicks и id для PUT запросов
    const currentClicks = Number(current.attributes.clicks) || 0;
    const inviterClicks = Number(inviter.attributes.clicks) || 0;

    console.log(`Текущий кликов у игрока: ${currentClicks}, у пригласившего: ${inviterClicks}`);

    // Важно: для PUT запросов используем system id, а не documentId
    const inviterId = inviter.id;
    const playerId = current.id;

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

    // Дополнительно: можно сделать повторный запрос, чтобы получить обновленные данные пригласившего
    const updatedInviterRes = await axios.get(`${API_BASE_URL}/players/${inviterId}`, {
      params: { populate: "*" },
    });

    const updatedInviter = updatedInviterRes.data.data;
    console.log("🔄 Обновлённые данные пригласившего:", updatedInviter);

    // Здесь можно обновить локальное состояние, если нужно
    // onLocalBonus(updatedInviter); // например, передать обновленного пригласившего

    console.log("🎉 Бонусы успешно выданы");

    if (onLocalBonus) onLocalBonus();

  } catch (err) {
    console.error("❌ Ошибка в referralBonusDebug:", err);
  }
};
