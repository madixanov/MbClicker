import { lazy } from "react";
import { useEffect } from "react";
import usePlayerData from "../hooks/usePlayerData";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/exchange-page-layout/Main'))

const ExchangePage = () => {

    const { loadPlayer} = usePlayerData();

    useEffect(() => {
            loadPlayer();
            document.body.classList.add("other-page")
            return () => {
                document.body.classList.remove('other-page')
            }
        }, [loadPlayer])

    return (
        <div className="exchange-content">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default ExchangePage;