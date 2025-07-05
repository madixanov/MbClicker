import axios from "axios";

export const fetchBonuses = async () => {
  try {
    const res = await axios.get("https://mbclickerstrapi.onrender.com/api/bonuses", {
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
        `https://mbclickerstrapi.onrender.com/api/bonuses/${bonusId}`,
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
