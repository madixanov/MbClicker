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
    saveTokensToStrapi
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

  // Применение реферального бонуса с защитой от сброса
  useEffect(() => {
    if (!player?.documentId || hasAppliedBonus.current) return;

    const applyReferralBonus = async () => {
      const pendingCode = localStorage.getItem("pendingInviteCode");
      const bonusAlreadyGiven = player.referal_bonus_given;

      if (pendingCode && !bonusAlreadyGiven) {
        try {
          console.log("🎁 Пытаемся применить реферальный бонус...");
          hasAppliedBonus.current = true;
          
          // 1. Сначала обновляем локальное состояние
          const newCount = mbCountAll + 2500;
          setMbCountAll(newCount);
          
          // 2. Затем сохраняем на сервер
          await referralBonus(
            player.documentId,
            async () => {
              console.log("✅ Реферальный бонус успешно применен");
              
              // 3. Форсируем синхронизацию с сервером
              await saveTokensToStrapi();
              localStorage.removeItem("pendingInviteCode");
              
              console.log("🔄 Состояние синхронизировано с сервером");
            },
            newCount // Передаем уже обновленное значение
          );
        } catch (error) {
          console.error("❌ Ошибка применения реферального бонуса:", error);
          // Откатываем изменения при ошибке
          setMbCountAll(mbCountAll);
          hasAppliedBonus.current = false;
        }
      }
    };

    applyReferralBonus();
  }, [player?.documentId, player?.referal_bonus_given]);

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