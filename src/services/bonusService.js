export const fetchBonusesByPlayer = async (playerDocumentId) => {
  try {
    const res = await fetch(
      `https://mbclickerstrapi.onrender.com/api/bonuses?filters[player][documentId][$eq]=${playerDocumentId}&sort=createdAt:desc`
    );

    if (!res.ok) throw new Error("Не удалось загрузить бонусы");

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Ошибка при загрузке бонусов:", error);
    return [];
  }
};
