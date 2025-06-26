import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  createPlayer,
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData";

const useTelegramAuth = () => {
  const isCreating = useRef(false);
  const { setPlayer } = usePlayerData();

  const getInviteCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("start") || null; // Телеграм передаёт код в ?start=...
  };

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
      const invite_code = nanoid(8); // Сгенерировать свой invite_code
      const referrerCode = getInviteCodeFromUrl(); // код пригласившего

      let invited_by = null;

      if (referrerCode) {
        try {
          const referrer = await fetchPlayerByInviteCode(referrerCode);
          if (referrer) {
            invited_by = referrer.id; // Получаем ID пригласившего
            console.log("🔗 Реферал найден:", invited_by);
          } else {
            console.warn("⚠️ Реферал по коду не найден:", referrerCode);
          }
        } catch (err) {
          console.error("❌ Ошибка при поиске пригласившего:", err);
        }
      }

      const telegramUser = {
        telegram_id,
        username: user.username || "",
        photo_url: user.photo_url || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        invite_code,
        invited_by, // ← устанавливаем ID пригласившего
      };

      try {
        const existingPlayer = await fetchPlayerByTelegramId(telegram_id);

        if (!existingPlayer) {
          const res = await createPlayer(telegramUser);
          const newPlayer = res.data?.data;

          if (newPlayer) {
            setPlayer(newPlayer);
          }
        } else {
          setPlayer(existingPlayer);
        }
      } catch (err) {
        console.error("❌ Ошибка при авторизации:", err);
      } finally {
        isCreating.current = false;
      }
    };

    initAuth();
  }, [setPlayer]);

};

export default useTelegramAuth;
