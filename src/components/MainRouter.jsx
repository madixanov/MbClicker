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

// Lazy загрузка страниц
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  const { player } = usePlayerData();

  useTelegramAuth();
  useSyncOnUnload();

  useEffect(() => {
    if (player?.documentId) {
      referralBonus(player.documentId, () => {
      });
    }
  }, [player]);

  const appReady = useAppReady();
  window.location.reload();

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
