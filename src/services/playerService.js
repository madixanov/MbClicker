import { API_BASE_URL } from "../config/api";

// ✅ Получить игрока по telegram_id
export const fetchPlayerByTelegramId = async (telegram_id) => {
  const url = new URL(`${API_BASE_URL}/players`);
  url.searchParams.append("filters[telegram_id][$eq]", telegram_id);
  url.searchParams.append("publicationState", "preview");

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error("Ошибка при получении игрока");

  const data = await res.json();
  return data?.data?.[0] || null;
};

// ✅ Обновить игрока по documentId
export const updatePlayer = async (documentId, fields = {}) => {
  const res = await fetch(`${API_BASE_URL}/players/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: fields }),
  });

  if (!res.ok) throw new Error("Ошибка при обновлении игрока");
  return res.json();
};

// ✅ Создать нового игрока
export const createPlayer = async (playerData) => {
  const res = await fetch(`${API_BASE_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: playerData }),
  });

  if (!res.ok) throw new Error("Ошибка при создании игрока");
  return res.json();
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
