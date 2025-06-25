import { lazy, useEffect } from "react";
import '../layouts/stats-page-layout/stats-page.css'
import usePlayerData from "../hooks/usePlayerData";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import ('../layouts/stats-page-layout/Main'))

const StatsPage = () => {
    const { loadPlayer} = usePlayerData();

    useEffect(() => {
            loadPlayer();
            document.body.classList.add("other-page")
            return () => {
                document.body.classList.remove('other-page')
            }
        }, [loadPlayer])

    return (
        <div className="stats-page">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default StatsPage;