import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";

const useSyncOnRouteChange = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const syncData = async () => {
      const store = useMbStore.getState();
      const lvlStore = useLvlStore.getState();
      await store.saveTokensToStrapi();
      console.log('Сохранили MB') // 💾 сохранить текущие данные
      await store.loadMbFromPlayer();
      console.log("ЗАгрузили MB")
      await lvlStore.loadLevelFromStrapi();
      console.log("Загрузили уровень")   // 📥 загрузить обновления
    };

    if (location.pathname !== prevPath.current) {
      syncData(); // 📌 вызов при смене страницы
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);
};

export default useSyncOnRouteChange;
