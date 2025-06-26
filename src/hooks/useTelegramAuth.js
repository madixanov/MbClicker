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

  console.log("🌐 URL:", window.location.href);
  console.log("🔍 URLSearchParams start:", new URLSearchParams(window.location.search).get("start"));
  console.log("🤖 Telegram initDataUnsafe:", window?.Telegram?.WebApp?.initDataUnsafe);
  console.log("📦 Telegram start_param:", window?.Telegram?.WebApp?.initDataUnsafe?.start_param);

  const getInviteCodeFromUrl = () => {
    try {
      // 1. Самый надёжный способ — через Telegram WebApp initDataUnsafe
      const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (startParam) {
        console.log("📦 Получен start_param из initDataUnsafe:", startParam);
        return startParam;
      }

      // 2. Альтернативный способ — через tgWebAppData в hash
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
      const invite_code = nanoid(8);
      const referrerCode = getInviteCodeFromUrl();

      let invited_by = null;

      if (referrerCode) {
        try {
          const referrer = await fetchPlayerByInviteCode(referrerCode);
          if (referrer) {
            invited_by = referrer.documentId; // documentId для Strapi 5
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
        ...(invited_by && {
          invited_by: {
            connect: [invited_by], // ✅ подключаем связь
          },
        }),
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
