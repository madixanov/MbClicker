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
import useMbStore from "../store/mb-store"; // Убедитесь в правильности импорта

// Lazy загрузка страниц
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  // Получаем методы хранилища напрямую
  const { mbCountAll, setMbCountAll, setInviteCode } = useMbStore();
  const { player, loadPlayer } = usePlayerData();

  useTelegramAuth();
  useSyncOnUnload();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    
    if (inviteCode) {
      console.log('🔗 Реферальный код из URL:', inviteCode);
      setInviteCode(inviteCode);
      localStorage.setItem('pendingInviteCode', inviteCode);
    }
  }, [setInviteCode]);

  useEffect(() => {
    const bonusKey = "referralBonusApplied";
    const pendingCode = localStorage.getItem('pendingInviteCode');

    if (player?.documentId && pendingCode && !localStorage.getItem(bonusKey)) {
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
  }, [player?.documentId, mbCountAll, setMbCountAll, loadPlayer]);

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