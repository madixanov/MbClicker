import { lazy, Suspense } from "react";
import './home-page.css';
import LoadingPage from '../../pages/LoadingPage';
import { Helmet } from "react-helmet";
import avatar from '../../assets/images/avatar.png';

const ProgressBar = lazy(() => import("./UI/ProgressBar"));
const MbCounter = lazy(() => import("./UI/MbCounter"));
const Avatar = lazy(() => import("./UI/Avatar"));

const Main = () => {
    return (
        <main className="home-main">
            <Helmet>
                <link rel="preload" as="image" href={avatar} />
            </Helmet>

            <Suspense fallback={<LoadingPage />}>
                <ProgressBar />
                <MbCounter />
                <Avatar />
            </Suspense>
        </main>
    )
}

export default Main;