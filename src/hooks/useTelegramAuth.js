import { useEffect, useRef } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  createPlayer,
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData"; // ✅ импорт хука

const useTelegramAuth = () => {
  const isCreating = useRef(false); // 🔒 защита от повторов
  const { setPlayer } = usePlayerData(); // ✅ доступ к setPlayer

  useEffect(() => {
    const initAuth = async () => {
      if (isCreating.current) return;
      isCreating.current = true;

      const user = getTelegramUser();
      if (!user) {
        isCreating.current = false;
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
          const newPlayer = res.data?.data;

          // ✅ сразу сохраняем в состояние
          if (newPlayer) {
            setPlayer(newPlayer);
          }
        } else {
          console.log("✅ Пользователь уже существует (id:", existingPlayer.id, ")");
          setPlayer(existingPlayer); // ✅ гарантированная установка
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
      } finally {
        isCreating.current = false;
      }
    };

    initAuth();
  }, [setPlayer]); // 🔁 зависимость для React (хотя setPlayer стабилен)
};

export default useTelegramAuth;
