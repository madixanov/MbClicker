import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense }  from "react";

const HomePage = lazy(() => import("./pages/HomePage"))
const ExchangePage = lazy(() => import("./pages/ExchangePage"))
const TaskPage = lazy(() => import("./pages/TaskPage"))
const GiftPage = lazy(() => import("./pages/GiftPage"))

const App = () => {

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exchange" element={<ExchangePage />}/>
          <Route path="/tasks" element={<TaskPage />}/>
          <Route path="/gift" element={<GiftPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;