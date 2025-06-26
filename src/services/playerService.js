import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const fetchPlayerByTelegramId = async (telegram_id) => {
  const res = await axios.get(`${API_BASE_URL}/players`, {
    params: {
      filters: {
        telegram_id: {
          $eq: telegram_id,
        },
      },
      publicationState: "preview",
    },
  });

  return res.data?.data?.[0] || null;
};

export const updatePlayer = async (documentId, fields = {}) => {
  return axios.put(`${API_BASE_URL}/players/${documentId}`, {
    data: fields,
  });
};

export const createPlayer = async (playerData) => {
  return axios.post(`${API_BASE_URL}/players`, {
    data: playerData,
  });
};

// ✅ Отложенное обновление при offline/ошибке
export const updatePlayerWithFallback = async (documentId, fields = {}) => {
  try {
    await updatePlayer(documentId, fields);
    console.log("✅ Обновлено:", fields);
    localStorage.removeItem("pendingUpdate");
  } catch (err) {
    console.warn(`⚠️ Ошибка при обновлении: ${err}. Сохраняем в очередь: ${fields}`);
    localStorage.setItem(
      "pendingUpdate",
      JSON.stringify({ documentId, fields })
    );
  }
};

// ✅ Повторная попытка при запуске
export const retryPendingUpdate = async () => {
  const item = localStorage.getItem("pendingUpdate");
  if (!item) return;

  try {
    const { documentId, fields } = JSON.parse(item);
    await updatePlayerWithFallback(documentId, fields);
  } catch (err) {
    console.error("❌ Ошибка при повторной попытке обновления:", err);
  }
};

export const fetchDashboardPlayers = async () => {
  const res = await axios.get(`${API_BASE_URL}/players?sort=clicks:desc&pagination[limit]=3`);
  return res.data?.data;;
}