import { lazy } from "react";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/exchange-page-layout/Main'))

const ExchangePage = () => {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default ExchangePage;