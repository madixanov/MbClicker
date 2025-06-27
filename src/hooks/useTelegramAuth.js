import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  createPlayer,
  updatePlayerWithFallback,
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData";

const useTelegramAuth = () => {
  const isCreating = useRef(false);
  const { setPlayer } = usePlayerData();

  const getInviteCode = () => {
    try {
      const initStart = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (initStart) {
        console.log("📦 [start_param] Из initDataUnsafe:", initStart);
        return initStart;
      }

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const tgWebAppData = params.get("tgWebAppData");

      if (tgWebAppData) {
        const decoded = decodeURIComponent(tgWebAppData);
        const innerParams = new URLSearchParams(decoded);
        const start = innerParams.get("start");
        if (start) {
          console.log("📦 [start] Из tgWebAppData:", start);
          return start;
        }
      }

      const localRef = localStorage.getItem("ref_code");
      if (localRef) {
        console.log("📦 [start] Из localStorage:", localRef);
        return localRef;
      }

      console.warn("📭 invite_code не найден ни в initData, ни в localStorage");
      return null;
    } catch (err) {
      console.error("❌ Ошибка при извлечении invite_code:", err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (isCreating.current) return;
      isCreating.current = true;

      const user = getTelegramUser();
      if (!user) {
        console.warn("❌ Пользователь Telegram не найден");
        isCreating.current = false;
        return;
      }

      const telegram_id = Number(user.id);
      const refCode = getInviteCode();
      let invited_by = null;

      if (refCode) {
        try {
          const referrer = await fetchPlayerByInviteCode(refCode);
          if (referrer) {
            invited_by = referrer.documentId;
            console.log("🔗 Реферал найден:", invited_by);
          } else {
            console.warn("⚠️ Реферал по коду не найден:", refCode);
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

          if (newPlayer) {
            console.log("✅ Новый игрок успешно создан:", newPlayer);
            setPlayer(newPlayer);
          }
        } else {
          console.log("👤 Игрок уже существует:", existingPlayer);

          // Обновим invited_by только если ещё не установлен
          if (!existingPlayer.invited_by && invited_by) {
            console.log("🔁 Обновляем invited_by для существующего игрока");
            await updatePlayerWithFallback(existingPlayer.documentId, {
              invited_by: { connect: [invited_by] },
            });
          }

          setPlayer(existingPlayer);
        }
      } catch (err) {
        console.error("❌ Ошибка при авторизации игрока:", err);
      } finally {
        isCreating.current = false;
      }
    };

    initAuth();
  }, [setPlayer]);
};

export default useTelegramAuth;
