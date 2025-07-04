import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useRef } from "react";
import LoadingPage from "../pages/LoadingPage";
import AutoSaveClicks from "./AutoSaveClisk";
import usePlayerData from "../hooks/usePlayerData";
import { referralBonus } from "../hooks/useReferralBonus";
import { retryPendingUpdate } from "../services/playerService";
import useMbStore from "../store/mb-store";
import useLvlStore from "../store/lvl-store";
import useTelegramAuth from "../hooks/useTelegramAuth";
import useSyncOnUnload from "../hooks/useSyncOnUnload";

// Ленивая загрузка страниц
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
  } = useMbStore();
  const { loadLevelFromStrapi } = useLvlStore();

  const [isAppReady, setIsAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const hasInitialized = useRef(false);
  const hasAppliedBonus = useRef(false); // защита от двойного вызова

  useTelegramAuth();
  useSyncOnUnload();

  // 📦 1. Инициализация
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initApp = async () => {
      try {
        setLoadingProgress(10);
        await loadPlayer();              // загрузка игрока
        await loadMbFromPlayer();        // загрузка мегабайтов
        await loadLevelFromStrapi();     // загрузка уровня

        setLoadingProgress(50);

        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("invite");
        if (inviteCode) {
          console.log("🔗 Реферальный код из URL:", inviteCode);
          setInviteCode(inviteCode);
          localStorage.setItem("pendingInviteCode", inviteCode);
        }

        setLoadingProgress(80);
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

  // 🎁 2. Применение реферального бонуса
  useEffect(() => {
    if (!player?.documentId) return;

    console.log("👤 player useEffect (с documentId):", player.documentId);

    const bonusKey = "referralBonusApplied";
    const pendingCode = localStorage.getItem("pendingInviteCode");

    if (
      pendingCode &&
      !localStorage.getItem(bonusKey) &&
      !hasAppliedBonus.current
    ) {
      hasAppliedBonus.current = true;

      const newCount = mbCountAll + 2500;
      console.log("🎁 Применяем бонус для игрока:", player.documentId);

      referralBonus(
        player.documentId,
        async () => {
          localStorage.setItem(bonusKey, "true");
          localStorage.removeItem("pendingInviteCode");
          setMbCountAll(newCount);
          console.log("✅ Бонус применён: +2500 МБ");
        },
        mbCountAll
      );
    }
  }, [player?.documentId]);

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
