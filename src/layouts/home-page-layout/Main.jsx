import { lazy, Suspense } from "react";
import './home-page.css';
import LoadingPage from '../../pages/LoadingPage'

const ProgressBar = lazy(() => import("./UI/ProgressBar"));
const MbCounter = lazy(() => import("./UI/MbCounter"));
const Avatar = lazy(() => import("./UI/Avatar"));

const Main = () => {
    return (
        <main className="home-main">
            <Suspense fallback={<LoadingPage />}>
                <ProgressBar />
                <MbCounter />
                <Avatar />
            </Suspense>
        </main>
    )
}

export default Main;