import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import LoadingPage from "../pages/LoadingPage";
import AutoSaveClicks from "./AutoSaveClisk";
import useTelegramAuth from "../hooks/useTelegramAuth";
import { retryPendingUpdate } from "../services/playerService";
import useSyncOnUnload from "../hooks/useSyncOnUnload";
import usePlayerData from "../hooks/usePlayerData";
import { referralBonus } from "../hooks/useReferralBonus";
import useMbStore from "../store/mb-store";

// Ленивая загрузка страниц
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  const { mbCountAll, setMbCountAll, setInviteCode } = useMbStore();
  const { player, loadPlayer } = usePlayerData();
  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useTelegramAuth();
  useSyncOnUnload();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Этап 1: Инициализация (10%)
        setLoadingProgress(10);
        
        // Загружаем параметры URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        
        if (inviteCode) {
          console.log('🔗 Реферальный код из URL:', inviteCode);
          setInviteCode(inviteCode);
          localStorage.setItem('pendingInviteCode', inviteCode);
        }

        // Этап 2: Загрузка данных игрока (30%)
        setLoadingProgress(30);
        await loadPlayer();

        // Этап 3: Проверка реферального бонуса (80%)
        setLoadingProgress(80);
        const bonusKey = "referralBonusApplied";
        const pendingCode = localStorage.getItem('pendingInviteCode');

        if (player?.documentId && pendingCode && !localStorage.getItem(bonusKey)) {
          const newCount = mbCountAll + 2500;
          await referralBonus(
            player.documentId, 
            async () => {
              localStorage.setItem(bonusKey, "true");
              localStorage.removeItem('pendingInviteCode');
              setMbCountAll(newCount);
              await loadPlayer();
            }, 
            mbCountAll
          );
        }

        // Этап 4: Завершение (100%)
        setLoadingProgress(100);
        await retryPendingUpdate();
        
        // Даем небольшую задержку для плавного завершения анимации
        setTimeout(() => setIsAppReady(true), 500);
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        // В случае ошибки все равно разрешаем загрузку
        setLoadingProgress(100);
        setIsAppReady(true);
      }
    };

    initApp();
  }, [player?.documentId, mbCountAll, setMbCountAll, loadPlayer, setInviteCode]);

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