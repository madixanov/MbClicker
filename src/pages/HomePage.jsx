import { lazy } from "react";

const Header = lazy(() => import("../components/Header"));
const Main = lazy(() => import("../layouts/home-page-layout/Main"));
const Footer = lazy(() => import("../components/Footer"));

const HomePage = () => {
    return (
        <div className="home-page">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default HomePage;