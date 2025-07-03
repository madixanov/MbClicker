import { useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayer } from "../services/playerService";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";

const useSyncOnUnload = () => {
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "hidden") return;

      const user = getTelegramUser();
      if (!user) return;

      try {
        const player = await fetchPlayerByTelegramId(user.id);
        if (!player?.documentId) return;

        const { mbCountAll, progressTokens } = useMbStore.getState();
        const { level } = useLvlStore.getState();

        await updatePlayer(player.documentId, {
          clicks: mbCountAll,
          progress_tokens: progressTokens,
          level: level,
        });

        console.log("✅ Прогресс синхронизирован при уходе");
      } catch (err) {
        console.error("❌ Ошибка при синхронизации при закрытии:", err);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useSyncOnUnload;
