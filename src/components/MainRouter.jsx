import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import LoadingPage from "../pages/LoadingPage";
import AutoSaveClicks from "./AutoSaveClisk";
import useTelegramAuth from "../hooks/useTelegramAuth";
import { retryPendingUpdate } from "../services/playerService";
import useSyncOnUnload from "../hooks/useSyncOnUnload";
import useAppReady from "../hooks/useAppReady";
import usePlayerData from "../hooks/usePlayerData";
import { referralBonus } from "../hooks/useReferralBonus";
import useMbStore from "../store/mb-store";

// Lazy загрузка страниц
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  const { player, loadPlayer } = usePlayerData();
  const { mbCountAll, setMbCountAll, setInviteCode } = useMbStore();

  useTelegramAuth();
  useSyncOnUnload();

  useEffect(() => {
    // Извлекаем реферальный код из URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    
    if (inviteCode) {
      console.log('🔗 Реферальный код из URL:', inviteCode);
      setInviteCode(inviteCode);
      
      // Сохраняем код в localStorage на случай перезагрузки
      localStorage.setItem('pendingInviteCode', inviteCode);
    } else {
      // Проверяем, есть ли сохраненный код
      const savedCode = localStorage.getItem('pendingInviteCode');
      if (savedCode) {
        setInviteCode(savedCode);
      }
    }
  }, []);

  useEffect(() => {
    const bonusKey = "referralBonusApplied";

    if (player?.documentId) {
      // Проверяем есть ли необработанный реферальный код
      const pendingCode = localStorage.getItem('pendingInviteCode');
      
      if (pendingCode && !localStorage.getItem(bonusKey)) {
        const newCount = mbCountAll + 2500;
        referralBonus(
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
    }
  }, [player?.documentId]);

  const appReady = useAppReady();

  useEffect(() => {
    retryPendingUpdate();
  }, []);

  if (!appReady) return <LoadingPage />;

  return (
    <>
      <AutoSaveClicks />
      <Suspense fallback={<LoadingPage />}>
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