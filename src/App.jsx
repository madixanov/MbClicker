import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect }  from "react";
import LoadingPage from "./pages/LoadingPage";
import useTelegramAuth from "./hooks/useTelegramAuth";
import AutoSaveClicks from "./components/AutoSaveClisk";
import { retryPendingUpdate } from "./services/playerService";

const HomePage = lazy(() => import("./pages/HomePage"))
const ExchangePage = lazy(() => import("./pages/ExchangePage"))
const TaskPage = lazy(() => import("./pages/TaskPage"))
const GiftPage = lazy(() => import("./pages/GiftPage"))
const StatsPage = lazy(() => import('./pages/StatsPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))

const App = () => {
  useTelegramAuth();

  useEffect(() => {
    retryPendingUpdate();
  }, []);

  return (
    <BrowserRouter>
      <AutoSaveClicks />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/tasks" element={<TaskPage />}/>
          <Route path="/" element={<HomePage />} />
          <Route path="/exchange" element={<ExchangePage />}/>
          <Route path="/stats" element={<StatsPage />}/>
          <Route path="/friends" element={<FriendsPage />}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;