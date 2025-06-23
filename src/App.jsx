import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import LoadingPage from "./pages/LoadingPage";
import useTelegramAuth from "./hooks/useTelegramAuth";
import AutoSaveClicks from "./components/AutoSaveClisk";
import { retryPendingUpdate } from "./services/playerService";
import useSyncOnUnload from "./hooks/useSyncOnUnload";
import useAppReady from "./hooks/useAppReady";

// Lazy загружаемые страницы
const HomePage = lazy(() => import("./pages/HomePage"));
const ExchangePage = lazy(() => import("./pages/ExchangePage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const GiftPage = lazy(() => import("./pages/GiftPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const FriendsPage = lazy(() => import("./pages/FriendsPage"));

const App = () => {
  useTelegramAuth();         // Получение данных из Telegram WebApp
  useSyncOnUnload();         // Сохранение перед закрытием
  const appReady = useAppReady(); // ⬅ Ждём загрузку player, level и mb из Strapi

  useEffect(() => {
    retryPendingUpdate();    // Повторная отправка неудачных обновлений
  }, []);

  // Пока всё не готово — показываем глобальный LoadingPage
  if (!appReady) return <LoadingPage />;

  return (
    <BrowserRouter>
      <AutoSaveClicks /> {/* Автосохранение кликов */}
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
    </BrowserRouter>
  );
};

export default App;
