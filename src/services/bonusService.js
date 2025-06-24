import axios from "axios";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId } from "./playerService";

export const fetchBonusesByPlayer = async () => {
  try {
    // 1. Получаем Telegram пользователя
    const tgUser = getTelegramUser();
    if (!tgUser) throw new Error("Нет данных Telegram пользователя");

    // 2. Получаем игрока из Strapi по telegram_id
    const player = await fetchPlayerByTelegramId(tgUser.id);
    if (!player) throw new Error("Игрок не найден");

    // 3. Загружаем все бонусы с populate
    const res = await axios.get("https://mbclickerstrapi.onrender.com/api/bonuses", {
      params: {
        sort: "createdAt:desc",
        populate: "player",
      },
    });

    // 4. Фильтруем по documentId на клиенте
    const allBonuses = res.data?.data || [];
    const filteredBonuses = allBonuses.filter(
      (bonus) => bonus.player?.documentId === player.documentId
    );

    return filteredBonuses;
  } catch (error) {
    console.error("Ошибка при загрузке бонусов:", error?.response?.data || error);
    return [];
  }
};
