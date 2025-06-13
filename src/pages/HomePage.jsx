import { lazy } from "react";

const Header = lazy(() => import("../components/Header"));
const Main = lazy(() => import("../layouts/home-page-layout/Main"));
const Footer = lazy(() => import("../components/Footer"));

const HomePage = () => {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default HomePage;