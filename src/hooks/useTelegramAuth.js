import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  createPlayer,
  updatePlayer,
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData";

const useTelegramAuth = () => {
  const isCreating = useRef(false);
  const { setPlayer } = usePlayerData();

  const getInviteCode = () => {
    try {
      // 1️⃣ initDataUnsafe от Telegram
      const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (startParam) {
        console.log("📦 [start_param] из Telegram:", startParam);
        localStorage.setItem("ref_code", startParam);
        return startParam;
      }

      // 2️⃣ ?invite=... из URL (например, при запуске без start_param)
      const urlParams = new URLSearchParams(window.location.search);
      const urlInvite = urlParams.get("invite");
      if (urlInvite) {
        console.log("📦 [invite] из URL:", urlInvite);
        // Сохраняем только если ещё не сохранено
        if (!localStorage.getItem("ref_code")) {
          localStorage.setItem("ref_code", urlInvite);
        }
        return urlInvite;
      }

      // 3️⃣ localStorage на случай, если ранее уже заходил по ссылке
      const savedInvite = localStorage.getItem("ref_code");
      if (savedInvite) {
        console.log("📦 [invite] из localStorage:", savedInvite);
        return savedInvite;
      }

      console.warn("📭 Invite-код не найден ни в initData, ни в URL, ни в localStorage");
      return null;
    } catch (err) {
      console.error("❌ Ошибка при получении invite-кода:", err);
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
      const referrerCode = getInviteCode();
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
        console.log('telegram auth')
        const existingPlayer = await fetchPlayerByTelegramId(telegram_id);

        if (!existingPlayer) {
          const newPlayerData = {
            telegram_id,
            username: user.username || "",
            photo_url: user.photo_url || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            invite_code: nanoid(8),
            ...(invited_by && { invited_by: { connect: [invited_by] } }),
          };

          console.log("🆕 Создание нового игрока:", newPlayerData);
          const res = await createPlayer(newPlayerData);
          const newPlayer = res.data?.data;
          if (newPlayer) {
            console.log("✅ Новый игрок создан:", newPlayer);
            setPlayer(newPlayer);
          }
        } else {
          console.log("👤 Игрок уже существует:", existingPlayer);

          if (!existingPlayer.invited_by && invited_by) {
            console.log("🔁 Обновляем invited_by для существующего игрока");
            await updatePlayer(existingPlayer.documentId, {
              invited_by: { connect: [invited_by] },
            });
          }

          setPlayer(existingPlayer);
        }
      } catch (err) {
        console.error("❌ Ошибка при создании/обновлении игрока:", err);
      } finally {
        isCreating.current = false;
      }
    };

    initAuth();
  }, [setPlayer]);

  return null;
};

export default useTelegramAuth;
