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
    // Получаем игрока по telegram_id
    const res = await axios.get(
      "https://mbclickerstrapi.onrender.com/api/players",
      {
        params: {
          filters: {
            telegram_id: {
              $eq: telegramId,
            },
          },
          publicationState: "preview", // важно для Strapi v5
        },
      }
    );

    const player = res.data.data[0];
    if (!player) {
      console.warn("⚠️ Игрок не найден");
      return;
    }

    const documentId = player.documentId;

    // Обновляем поле clicks по documentId
    await axios.put(
      `https://mbclickerstrapi.onrender.com/api/players/document/${documentId}`,
      {
        data: {
          clicks: mbCountAll,
        },
      }
    );

    console.log("✅ Клики успешно синхронизированы в Strapi");
  } catch (error) {
    console.error("❌ Ошибка при сохранении кликов:", error.response?.data || error);
  }
};

export default syncClicksToStrapi;
