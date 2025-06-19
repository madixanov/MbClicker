import { useEffect, useState } from "react";
import axios from "axios";

const usePlayerData = () => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (!user) return;

    const telegramId = user.id;

    axios
      .get(
        `https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegramId}`
      )
      .then((res) => {
        const data = res.data.data;
        if (data.length > 0) {
          setPlayer(data[0].attributes);
        } else {
          console.warn("⚠️ Игрок не найден");
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
