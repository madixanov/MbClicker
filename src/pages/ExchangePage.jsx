import { lazy } from "react";
import { useEffect } from "react";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/exchange-page-layout/Main'))

const ExchangePage = () => {

    useEffect(() => {
            document.body.classList.add("other-page")
            return () => {
                document.body.classList.remove('other-page')
            }
        }, [])

    return (
        <div className="exchange-content">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default ExchangePage;