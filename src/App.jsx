import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "./pages/LoadingPage";
import useTelegramAuth from "./hooks/useTelegramAuth";
import useSyncOnUnload from "./hooks/useSyncOnUnload";

const MainRouter = lazy(() => import("./components/MainRouter"));

const App = () => {
  useTelegramAuth();
  useSyncOnUnload();

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <MainRouter />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
