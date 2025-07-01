import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useRef } from "react";
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
  const hasInitialized = useRef(false);

  useTelegramAuth();
  useSyncOnUnload();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initApp = async () => {
      try {
        setLoadingProgress(10);

        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("invite");

        if (inviteCode) {
          console.log("🔗 Реферальный код из URL:", inviteCode);
          setInviteCode(inviteCode);
          localStorage.setItem("pendingInviteCode", inviteCode);
        }

        setLoadingProgress(30);
        await loadPlayer();

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
              await loadPlayer();
            },
            mbCountAll
          );
        }

        setLoadingProgress(90);
        await retryPendingUpdate();

        setLoadingProgress(100);
        setTimeout(() => setIsAppReady(true), 500);
      } catch (error) {
        console.error("Ошибка инициализации приложения:", error);
        setLoadingProgress(100);
        setIsAppReady(true);
      }
    };

    initApp();
  }, [mbCountAll, setMbCountAll, loadPlayer, setInviteCode, player?.documentId]);

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
