import { lazy } from "react";
import { useEffect } from "react";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/exchange-page-layout/Main'))

const ExchangePage = () => {
    document.documentElement.classList.add("exchange-mode");

    useEffect(() => {
        document.documentElement.classList.add("exchange-mode");

        return () => {
        document.documentElement.classList.remove("exchange-mode");
        };
    }, []);

    return (
        <div className="exchange-content">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default ExchangePage;