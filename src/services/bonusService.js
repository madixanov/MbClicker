import axios from "axios";

export const fetchBonusesByPlayer = async (playerDocumentId) => {
  try {
    const res = await axios.get("https://mbclickerstrapi.onrender.com/api/bonuses", {
      params: {
        "filters[player][documentId][$eq]": playerDocumentId,
        "sort": "createdAt:desc",
        "populate": "player",
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.error("Ошибка при загрузке бонусов:", error?.response?.data || error);
    return [];
  }
};
