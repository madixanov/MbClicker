import { lazy, useEffect } from "react";
import usePlayerData from "../hooks/usePlayerData";

const Header = lazy(() => import("../components/Header"));
const Main = lazy(() => import("../layouts/home-page-layout/Main"));
const Footer = lazy(() => import("../components/Footer"));

const HomePage = () => {
    const { loadPlayer } = usePlayerData();
    useEffect(() => {
        loadPlayer();
    }, [loadPlayer]);

    return (
        <div className="home-page">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default HomePage;