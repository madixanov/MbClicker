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

  try {
    const res = await axios.get("https://mbclickerstrapi.onrender.com/api/players", {
      params: {
        filters: {
          telegram_id: {
            $eq: user.id,
          },
        },
        publicationState: "preview",
      },
    });

    const player = res.data.data[0];

    if (!player) {
      console.warn("⚠️ Игрок не найден");
      return;
    }

    const id = player.id; // ✅ используем id напрямую из data[0]

    await axios.put(`https://mbclickerstrapi.onrender.com/api/players/${id}`, {
      data: {
        clicks: mbCountAll,
      },
    });

    console.log("✅ Клики обновлены (ID:", id, ")");
  } catch (err) {
    console.error("❌ Ошибка при сохранении кликов:", err.response?.data || err);
  }
};

export default syncClicksToStrapi;
