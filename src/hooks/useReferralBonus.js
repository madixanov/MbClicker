import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus, mbCountAll) => {
  if (!documentId) {
    console.warn("❌ Нет documentId — бонус не проверяется");
    return;
  }

  try {
    console.log("🔍 Начинаем обработку реферального бонуса...");
    console.log("🆔 ID текущего игрока:", documentId);

    // 1. Получаем текущего игрока
    const playerRes = await axios.get(`${API_BASE_URL}/api/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: "*", // чтобы получить invited_by
      },
    });

    if (!playerRes.data.data.length) {
      console.warn("❌ Игрок не найден");
      return;
    }

    const current = playerRes.data.data[0];

    if (current.referal_bonus_given) {
      console.warn("⚠️ Бонус уже был выдан ранее");
      return;
    }

    const inviterId = current.invited_by?.documentId;

    if (!inviterId) {
      console.warn("❌ У игрока нет пригласившего (invited_by.documentId)");
      return;
    }

    console.log("📌 documentId пригласившего:", inviterId);

    // 2. Получаем пригласившего игрока
    const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: inviterId } },
        populate: "*",
      },
    });

    if (!inviterRes.data.data.length) {
      console.warn("❌ Пригласивший не найден");
      return;
    }

    const inviter = inviterRes.data.data[0];

    // 3. Начисляем бонусы
    const inviterClicks = Number(inviter.clicks) || 0;
    const currentClicks = Number(current.clicks) || 0;

    console.log(`📊 Клики до: Пригласивший - ${inviterClicks}, Игрок - ${currentClicks}`);

    // Обновляем пригласившего
    await axios.put(`${API_BASE_URL}/players/${inviter.documentId}`, {
      data: {
        clicks: inviterClicks + 2500,
      },
    });

    // Обновляем текущего игрока
    await axios.put(`${API_BASE_URL}/players/${current.documentId}`, {
      data: {
        clicks: currentClicks + 2500,
        referal_bonus_given: true,
      },
    });

    console.log("🎉 Бонусы успешно выданы!");
    console.log(`📊 Клики после: Пригласивший - ${inviterClicks + 2500}, Игрок - ${currentClicks + 2500}`);

    if (typeof onLocalBonus === "function") {
      onLocalBonus(); // например, setMbCountAll((prev) => prev + 2500)
    }

  } catch (err) {
    console.error("❌ Критическая ошибка в referralBonus:", err);
    if (err.response) {
      console.error("Данные ошибки:", err.response.data);
    }
  }
};