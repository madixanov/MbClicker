import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useRef } from "react";
import AppLoading from "../pages/AppLoading";
import PageLoading from "../pages/PageLoading";
import AutoSaveClicks from "./AutoSaveClisk";
import usePlayerData from "../hooks/usePlayerData";
import { referralBonus } from "../hooks/useReferralBonus";
import { retryPendingUpdate } from "../services/playerService";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";
import useTelegramAuth from "../hooks/useTelegramAuth";
import useSyncOnUnload from "../hooks/useSyncOnUnload";

// Lazy pages
const HomePage = lazy(() => import("../pages/HomePage"));
const ExchangePage = lazy(() => import("../pages/ExchangePage"));
const TaskPage = lazy(() => import("../pages/TaskPage"));
const GiftPage = lazy(() => import("../pages/GiftPage"));
const StatsPage = lazy(() => import("../pages/StatsPage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const MainRouter = () => {
  const { loadPlayer, player } = usePlayerData();
  const {
    mbCountAll,
    setMbCountAll,
    setInviteCode,
    loadMbFromPlayer,
    saveTokensToStrapi,
  } = useMbStore();
  const { loadLevelFromStrapi } = useLvlStore();

  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const hasInitialized = useRef(false);
  const hasAppliedBonus = useRef(false);

  useTelegramAuth();
  useSyncOnUnload();

  // Инициализация приложения
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initApp = async () => {
      try {
        setLoadingProgress(10);
        await loadPlayer();
        setLoadingProgress(30);
        await loadMbFromPlayer();
        setLoadingProgress(50);
        await loadLevelFromStrapi();
        setLoadingProgress(70);

        // Обработка реферального кода из URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("invite");
        if (inviteCode) {
          console.log("🔗 Реферальный код из URL:", inviteCode);
          setInviteCode(inviteCode);
          localStorage.setItem("pendingInviteCode", inviteCode);
        }

        await retryPendingUpdate();
        setLoadingProgress(100);
        setTimeout(() => setIsAppReady(true), 500);
      } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        setLoadingProgress(100);
        setIsAppReady(true);
      }
    };

    initApp();
  }, []);

  // Применение бонуса
  useEffect(() => {
    if (!player?.documentId || hasAppliedBonus.current) return;

    const applyReferralBonus = async () => {
      const pendingCode = localStorage.getItem("pendingInviteCode");
      const bonusAlreadyGiven = !!player.referal_bonus_given;

      if (pendingCode && !bonusAlreadyGiven) {
        try {
          hasAppliedBonus.current = true;
          console.log("Игрок: ", player)
          await referralBonus(player.documentId, () => {
            setMbCountAll(prev => prev + 2500);
          });

          await saveTokensToStrapi();
          localStorage.removeItem("pendingInviteCode");

        } catch (err) {
          console.error("❌ Ошибка применения бонуса:", err);
          hasAppliedBonus.current = false;
        }
      }
    };

    applyReferralBonus();
  }, [player?.documentId, player?.referal_bonus_given]);

  if (!isAppReady) return <AppLoading progress={loadingProgress} />;

  return (
    <>
      <AutoSaveClicks />
      <Suspense fallback={<PageLoading loading={true}/>}>
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
