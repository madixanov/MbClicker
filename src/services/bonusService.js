import axios from "axios";

export const fetchBonuses = async () => {
  try {
    const res = await axios.get("https://mbclickerstrapi.onrender.com/api/bonuses", {
      params: {
        sort: "createdAt:desc",
      },
    });

    const bonuses = res.data?.data || [];

    return bonuses;
  } catch (error) {
    console.error("Ошибка при загрузке бонусов:", error?.response?.data || error);
    return [];
  }
};
