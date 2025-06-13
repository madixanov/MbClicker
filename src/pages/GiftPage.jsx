import { lazy } from "react";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/gift-page-layout/Main'))

const GiftPage = () => {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default GiftPage;