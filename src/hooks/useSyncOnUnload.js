import { useEffect } from "react";
import getTelegramUser from "../utils/getTelegramUser";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";
import { API_BASE_URL } from "../config/api";

const useSyncOnUnload = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;

      const user = getTelegramUser();
      if (!user || !user.documentId) return;

      const { mbCountAll, progressTokens } = useMbStore.getState();
      const { level } = useLvlStore.getState();

      const data = JSON.stringify({
        clicks: mbCountAll,
        progress_tokens: progressTokens,
        level,
      });

      const url = `${API_BASE_URL}/api/players/${user.documentId}`;

      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: "application/json" });
        const success = navigator.sendBeacon(url, blob);
        if (success) {
          console.log("✅ Прогресс отправлен через sendBeacon");
        } else {
          console.warn("⚠️ sendBeacon не сработал, попробуем fetch");
          fallbackFetch();
        }
      } else {
        fallbackFetch();
      }

      function fallbackFetch() {
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        })
          .then(() => console.log("✅ Прогресс отправлен через fetch fallback"))
          .catch((err) =>
            console.error("❌ Ошибка отправки прогресса через fetch fallback:", err)
          );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useSyncOnUnload;
