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
import useLoadingStore from "../store/loading-store";

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
  const { setProgress } = useLoadingStore();

  useTelegramAuth();
  useSyncOnUnload();

  const appReady = useAppReady();

  // Инициализация загрузки и обработка реферального кода из URL
  useEffect(() => {
    setProgress(10);

    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get("invite");

    if (inviteCode) {
      console.log("🔗 Реферальный код из URL:", inviteCode);
      setInviteCode(inviteCode);
      localStorage.setItem("pendingInviteCode", inviteCode);
    }

    setProgress(30);
  }, [setInviteCode, setProgress]);

  // Обработка реферального бонуса и обновление игрока
  useEffect(() => {
    const bonusKey = "referralBonusApplied";
    const pendingCode = localStorage.getItem("pendingInviteCode");

    if (player?.documentId && pendingCode && !localStorage.getItem(bonusKey)) {
      const newCount = mbCountAll + 2500;

      referralBonus(
        player.documentId,
        async () => {
          localStorage.setItem(bonusKey, "true");
          localStorage.removeItem("pendingInviteCode");
          setMbCountAll(newCount);
          await loadPlayer();
        },
        mbCountAll
      );
      setProgress(80);
    } else {
      setProgress(80);
    }
  }, [player?.documentId, mbCountAll, setMbCountAll, loadPlayer, setProgress]);

  // Обработка отложенных обновлений и финализация прогресса
  useEffect(() => {
    async function runRetry() {
      await retryPendingUpdate();
    }
    runRetry();
    setProgress(100);
  }, [setProgress]);

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
