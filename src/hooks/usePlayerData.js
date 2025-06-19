import { useState, useEffect } from "react";
import axios from "axios";

const usePlayerData = () => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (!user) {
      console.warn("❌ Пользователь Telegram не найден");
      setLoading(false);
      return;
    }

    const telegramId = user.id;
    const url = `https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegramId}`;

    axios
      .get(url)
      .then((res) => {
        console.log("📥 Ответ от Strapi:", res.data);

        const data = res.data.data;
        if (data && data.length > 0) {
          setPlayer(data[0].attributes);
        } else {
          console.warn("⚠️ Игрок не найден в Strapi");
          setPlayer(null);
        }
      })
      .catch((err) => {
        console.error("❌ Ошибка при получении игрока:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { player, loading };
};

export default usePlayerData;
