import { useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, createPlayer } from "../services/playerService";

const useTelegramAuth = () => {
  useEffect(() => {
    const initAuth = async () => {
      const user = getTelegramUser();

      if (!user) {
        console.warn("❌ Пользователь Telegram не найден");
        return;
      }

      const telegram_id = Number(user.id);

      const telegramUser = {
        telegram_id,
        username: user.username || "",
        photo_url: user.photo_url || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      };

      try {
        const existingPlayer = await fetchPlayerByTelegramId(telegram_id);

        if (!existingPlayer) {
          const res = await createPlayer(telegramUser);
          console.log("🎉 Новый пользователь сохранён:", res.data);
          window.location.reload(); // ❗ перезагрузка по желанию
        } else {
          console.log("✅ Пользователь уже существует (id:", existingPlayer.id, ")");
        }
      } catch (err) {
        if (
          err.response?.status === 400 &&
          err.response.data?.error?.message?.includes("already exists")
        ) {
          console.warn("⚠️ Пользователь уже существует (ошибка дубликата)");
        } else {
          console.error("❌ Ошибка при авторизации:", err);
        }
      }
    };

    initAuth();
  }, []);
};

export default useTelegramAuth;
