import axios from "axios";
import { API_BASE_URL } from "../config/api";
import useMbStore from "../store/mb-store";

export const referralBonus = async (documentId, onLocalBonus, mbCountAll) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    const inviteCode = useMbStore.getState().inviteCode;
    
    if (!inviteCode) {
      console.warn("❌ Нет реферального кода");
      return;
    }

    console.log("🔍 Начинаем обработку реферального бонуса...");
    console.log("📌 Код приглашения:", inviteCode);
    console.log("🆔 ID игрока:", documentId);

    // Шаг 1: Находим пригласившего по реферальному коду
    console.log("🔎 Ищем пригласившего...");
    const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { referral_code: { $eq: inviteCode } },
        populate: '*',
      },
    });

    if (!inviterRes.data.data.length) {
      console.warn("❌ Пригласивший с таким кодом не найден");
      return;
    }

    const inviter = inviterRes.data.data[0];
    console.log("✅ Пригласивший найден:", inviter.id);

    // Шаг 2: Получаем данные текущего игрока
    console.log("🔎 Получаем данные текущего игрока...");
    const playerRes = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: '*',
      },
    });

    if (!playerRes.data.data.length) {
      console.warn("❌ Игрок не найден");
      return;
    }

    const current = playerRes.data.data[0];

    // Проверяем, не получал ли уже бонус
    if (current.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    // Шаг 3: Начисляем бонусы
    console.log("💰 Начисляем бонусы...");
    const inviterClicks = Number(inviter.clicks) || 0;
    const currentClicks = Number(current.clicks) || 0;

    console.log(`📊 Клики до: Пригласивший - ${inviterClicks}, Игрок - ${currentClicks}`);

    // Обновляем пригласившего
    await axios.put(`${API_BASE_URL}/players/${inviter.id}`, {
      data: {
        clicks: inviterClicks + 2500,
        updatedAt: new Date().toISOString()
      },
    });

    // Обновляем текущего игрока
    await axios.put(`${API_BASE_URL}/players/${current.id}`, {
      data: {
        clicks: currentClicks + 2500,
        referal_bonus_given: true,
        invited_by: inviter.id,
        updatedAt: new Date().toISOString()
      },
    });

    console.log("🎉 Бонусы успешно выданы!");
    console.log(`📊 Клики после: Пригласивший - ${inviterClicks + 2500}, Игрок - ${currentClicks + 2500}`);

    if (typeof onLocalBonus === "function") {
      onLocalBonus();
    }

  } catch (err) {
    console.error("❌ Критическая ошибка в referralBonus:", err);
    if (err.response) {
      console.error("Данные ошибки:", err.response.data);
    }
  }
};