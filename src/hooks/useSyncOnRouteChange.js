import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useMbStore from "../store/mb-store";

const useSyncOnRouteChange = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const syncData = async () => {
      const store = useMbStore.getState();
      await store.saveTokensToStrapi(); // 💾 сохранить текущие данные
      await store.loadMbFromPlayer();   // 📥 загрузить обновления
    };

    if (location.pathname !== prevPath.current) {
      syncData(); // 📌 вызов при смене страницы
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);
};

export default useSyncOnRouteChange;
