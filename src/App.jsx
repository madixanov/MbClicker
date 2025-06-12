import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense }  from "react";

const HomePage = lazy(() => import("./pages/HomePage"))
const ExchangePage = lazy(() => import("./pages/ExchangePage"))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exchange" element={<ExchangePage />}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;