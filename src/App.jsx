import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "./pages/LoadingPage";

const MainRouter = lazy(() => import("./MainRouter"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <MainRouter />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
