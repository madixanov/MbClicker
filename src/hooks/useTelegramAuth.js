import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import getTelegramUser from "../utils/getTelegramUser";
import {
  fetchPlayerByTelegramId,
  fetchPlayerByInviteCode,
  createPlayer,
  updatePlayerWithFallback,
  fetchPlayerWithFriends
} from "../services/playerService";
import usePlayerData from "../hooks/usePlayerData";
import useMbStore from "../store/mb-store";

const useTelegramAuth = () => {
  const isCreating = useRef(false);
  const { setPlayer } = usePlayerData();
  const setMbCountAll = useMbStore((state) => state.setMbCountAll);
  const mbCountAll = useMbStore((state) => state.mbCountAll);

  const getInviteCode = () => {
    try {
      const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (startParam) {
        console.log("\ud83d\udce6 [start_param] из Telegram:", startParam);
        localStorage.setItem("ref_code", startParam);
        return startParam;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const urlInvite = urlParams.get("invite");
      if (urlInvite) {
        console.log("\ud83d\udce6 [invite] из URL:", urlInvite);
        if (!localStorage.getItem("ref_code")) {
          localStorage.setItem("ref_code", urlInvite);
        }
        return urlInvite;
      }

      const savedInvite = localStorage.getItem("ref_code");
      if (savedInvite) {
        console.log("\ud83d\udce6 [invite] из localStorage:", savedInvite);
        return savedInvite;
      }

      console.warn("\ud83d\udced Invite-код не найден ни в initData, ни в URL, ни в localStorage");
      return null;
    } catch (err) {
      console.error("\u274c Ошибка при получении invite-кода:", err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (isCreating.current) return;
      isCreating.current = true;

      const user = getTelegramUser();
      if (!user) {
        console.warn("\u274c Пользователь Telegram не найден");
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
            console.log("\ud83d\udd17 Реферал найден:", invited_by);
          } else {
            console.warn("\u26a0\ufe0f Реферал по коду не найден:", referrerCode);
          }
        } catch (err) {
          console.error("\u274c Ошибка при поиске пригласившего:", err);
        }
      }

      try {
        const existingPlayer = await fetchPlayerWithFriends(telegram_id);

        let currentPlayer = null;

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

          console.log("\ud83d\udc86\u200d\u2642\ufe0f Создание нового игрока:", newPlayerData);
          const res = await createPlayer(newPlayerData);
          const newPlayer = res.data?.data;
          if (newPlayer) {
            setPlayer(newPlayer);
            currentPlayer = newPlayer;
          }
        } else {
          console.log("\ud83d\udc64 Игрок уже существует:", existingPlayer);

          if (!existingPlayer.invited_by && invited_by) {
            console.log("\ud83d\udd01 Обновляем invited_by для существующего игрока");
            await updatePlayerWithFallback(existingPlayer.documentId, {
              invited_by: { connect: [invited_by] },
            });
          }

          setPlayer(existingPlayer);
          currentPlayer = existingPlayer;
        }

        // 💰 ЛОГИКА БОНУСОВ
        if (currentPlayer) {
          if (!currentPlayer.bonus_given && currentPlayer.invited_friends?.length > 0) {
            const inviterBonus = currentPlayer.invited_friends.length * 2500;
            setMbCountAll(prev => prev + inviterBonus);
            console.log("\ud83c\udf81 Бонус пригласившему:", inviterBonus);

            await updatePlayerWithFallback(currentPlayer.documentId, {
              bonus_given: true,
            });
          }

          if (currentPlayer.invited_by && !currentPlayer.referral_bonus_received) {
            const invitedBonus = 2500;
            setMbCountAll(prev => prev + invitedBonus);
            console.log("\ud83c\udf81 Бонус приглашённому:", invitedBonus);

            await updatePlayerWithFallback(currentPlayer.documentId, {
              referral_bonus_received: true,
            });
          }
        }
      } catch (err) {
        console.error("\u274c Ошибка при создании/обновлении игрока:", err);
      } finally {
        isCreating.current = false;
      }
    };

    initAuth();
  }, [setPlayer]);

  return null;
};

export default useTelegramAuth;
