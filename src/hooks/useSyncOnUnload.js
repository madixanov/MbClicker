import { useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import { fetchPlayerByTelegramId, updatePlayerWithFallback } from "../services/playerService";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";

const useSyncOnUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const user = getTelegramUser();
      if (!user) return;

      const player = await fetchPlayerByTelegramId(user.id);
      if (!player || !player.documentId) return;

      const { mbCountAll, progressTokens } = useMbStore.getState();
      const { level } = useLvlStore.getState();

      try {
        await updatePlayerWithFallback(player.documentId, {
          clicks: mbCountAll,
          level,
          progress_tokens: progressTokens
        });
      } catch (err) {
        console.error("❌ Ошибка при синхронизации на выходе:", err);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default useSyncOnUnload;
