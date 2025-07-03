import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useRef } from "react";
import LoadingPage from "../pages/LoadingPage";
import AutoSaveClicks from "./AutoSaveClisk";
import usePlayerData from "../hooks/usePlayerData";
import { referralBonus } from "../hooks/useReferralBonus";
import { retryPendingUpdate } from "../services/playerService";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";

// Ленивая загрузка страниц
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  const { loadPlayer, player } = usePlayerData();
  const { mbCountAll, setMbCountAll, setInviteCode, loadMbFromPlayer } = useMbStore();
  const { loadLevelFromStrapi } = useLvlStore();

  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const hasInitialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      console.log("📦 MainRouter — вызов loadPlayer()");
      await loadPlayer();           // один раз загружаем
      await loadMbFromPlayer();     // один раз мегабайты
      await loadLevelFromStrapi();  // один раз уровень
      await retryPendingUpdate();   // один раз обновления
    }

    init();
  }, []);


  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initApp = async () => {
      try {
        setLoadingProgress(10);

        // 🎯 1. Читаем реферальный код из URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("invite");

        setLoadingProgress(30);
        if (inviteCode) {
          console.log("🔗 Реферальный код из URL:", inviteCode);
          setInviteCode(inviteCode);
          localStorage.setItem("pendingInviteCode", inviteCode);
        }

        // 👤 2. Загружаем игрока и его мегабайты
        

        setLoadingProgress(50);

        // 🎁 3. Проверка и применение реферального бонуса
        setLoadingProgress(80);
        const bonusKey = "referralBonusApplied";
        const pendingCode = localStorage.getItem("pendingInviteCode");

        if (player?.documentId && pendingCode && !localStorage.getItem(bonusKey)) {
          const newCount = mbCountAll + 2500;

          await referralBonus(
            player.documentId,
            async () => {
              localStorage.setItem(bonusKey, "true");
              localStorage.removeItem("pendingInviteCode");
              setMbCountAll(newCount);
            },
            mbCountAll
          );
        }

        // ⏫ 4. Повтор последнего обновления
        setLoadingProgress(90);
        await retryPendingUpdate();

        // ✅ 5. Готово
        setLoadingProgress(100);
        setTimeout(() => setIsAppReady(true), 500);
      } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        setLoadingProgress(100);
        setIsAppReady(true); // Даже если ошибка — грузим интерфейс
      }
    };

    initApp();
  }, []);

  if (!isAppReady) return <LoadingPage progress={loadingProgress} />;

  return (
    <>
      <AutoSaveClicks />
      <Suspense fallback={<LoadingPage progress={loadingProgress} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default MainRouter;
