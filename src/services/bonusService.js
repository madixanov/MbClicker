import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const fetchBonuses = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/bonuses`, {
      params: {
        sort: "createdAt:desc",
        populate: 'completedBy'
      },
    });

    const bonuses = res.data?.data || [];

    return bonuses;
  } catch (error) {
    console.error("Ошибка при загрузке бонусов:", error?.response?.data || error);
    return [];
  }
};

export const completeBonusForPlayer = async (playerId, bonusId) => {
  try {
    const res = await axios.put(
        `${API_BASE_URL}/api/bonuses/${bonusId}`,
        {
          data: {
            completedBy: {
              connect: [playerId],
            }
          }
        }
    )

    return res.data;
  } catch (err) {
    console.error("Ошибка при сохранении бонуса:", err?.response?.data || err)
    throw err;
  }
}
