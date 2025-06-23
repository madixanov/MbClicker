import { useState, useEffect } from "react";
import useLvlStore from "../store/lvl-store";
import useMbStore from "../store/mb-store";
import usePlayerData from "./usePlayerData";

const useAppReady = () => {
  const [ready, setReady] = useState(false);
  const { loadPlayer } = usePlayerData(); // ⬅️ добавлено

  useEffect(() => {
    const load = async () => {
      try {
        await loadPlayer(); // ⬅️ загружаем игрока
        await useLvlStore.getState().loadLevelFromStrapi();
        await useMbStore.getState().loadMbFromPlayer();
      } catch (e) {
        console.error("❌ Ошибка при инициализации:", e);
      } finally {
        setReady(true);
      }
    };

    load();
  }, []);

  return ready;
};

export default useAppReady;
