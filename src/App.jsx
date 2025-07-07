import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLoading from "./pages/AppLoading";

const MainRouter = lazy(() => import("./components/MainRouter"));

const App = () => {

  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <MainRouter />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
