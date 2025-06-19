import axios from "axios";
import useMbStore from "../store/mb-store";

const syncClicksToStrapi = async () => {
  const { mbCountAll } = useMbStore.getState();
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  if (!user) {
    console.warn("❌ Пользователь Telegram не найден");
    return;
  }

  const telegramId = user.id;

  try {
    // Получаем ID игрока
    const res = await axios.get(
      `https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegramId}`
    );

    const player = res.data.data[0];
    if (!player) {
      console.warn("⚠️ Игрок не найден");
      return;
    }

    const playerId = player.id - 1;

    // Обновляем поле clicks
    await axios.put(`https://mbclickerstrapi.onrender.com/api/players/${playerId}`, {
      data: {
        clicks: mbCountAll,
      },
    });

    console.log("✅ Клики успешно синхронизированы в Strapi");
  } catch (error) {
    console.error("❌ Ошибка при сохранении кликов:", error);
  }
};

export default syncClicksToStrapi;
