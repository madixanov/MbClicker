import { lazy, useEffect } from "react";

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import ('../layouts/stats-page-layout/Main'))

const StatsPage = () => {
    useEffect(() => {
                document.body.classList.add("other-page")
        
                return () => {
                    document.body.classList.remove('other-page')
                }
    }, [])

    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default StatsPage;