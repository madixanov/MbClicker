import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  createPlayer,
  updatePlayerWithFallback, // 🆕 Обязательно проверь, чтобы этот метод существовал
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData";

const useTelegramAuth = () => {
  const isCreating = useRef(false);
  const { setPlayer } = usePlayerData();

  const getInviteCodeFromUrl = () => {
    try {
      const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (startParam) {
        console.log("📦 Получен start_param из initDataUnsafe:", startParam);
        return startParam;
      }

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const rawData = params.get("tgWebAppData");

      if (rawData) {
        const decoded = decodeURIComponent(rawData);
        const innerParams = new URLSearchParams(decoded);
        const start = innerParams.get("start");
        if (start) {
          console.log("📦 Получен start из tgWebAppData:", start);
          return start;
        }
      }

      console.warn("📭 Не удалось извлечь invite_code (start_param)");
      return null;
    } catch (err) {
      console.error("❌ Ошибка при извлечении start_param:", err);
      return null;
    }
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
      const referrerCode = getInviteCodeFromUrl();

      let invited_by = null;

      if (referrerCode) {
        try {
          const referrer = await fetchPlayerByInviteCode(referrerCode);
          if (referrer) {
            invited_by = referrer.documentId;
            console.log("🔗 Реферал найден:", invited_by);
          } else {
            console.warn("⚠️ Реферал по коду не найден:", referrerCode);
          }
        } catch (err) {
          console.error("❌ Ошибка при поиске пригласившего:", err);
        }
      }

      try {
        const existingPlayer = await fetchPlayerByTelegramId(telegram_id);

        if (!existingPlayer) {
          const telegramUser = {
            telegram_id,
            username: user.username || "",
            photo_url: user.photo_url || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            invite_code: nanoid(8),
            ...(invited_by && {
              invited_by: { connect: [invited_by] },
            }),
          };

          console.log("🆕 Создание нового игрока:", telegramUser);
          const res = await createPlayer(telegramUser);
          const newPlayer = res.data?.data;
          if (newPlayer) setPlayer(newPlayer);
        } else {
          // 🧠 Обновим invited_by, если он ещё не установлен
          if (!existingPlayer.invited_by && invited_by) {
            console.log("🔁 Обновляем invited_by для существующего игрока");
            await updatePlayerWithFallback(existingPlayer.documentId, {
              invited_by: { connect: [invited_by] },
            });
          }

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
