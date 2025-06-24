import { lazy, Suspense } from "react";
import './home-page.css';
import LoadingPage from '../../pages/LoadingPage';
import { Helmet } from "react-helmet";
import avatar from '../../assets/images/avatar.webp';
import Avatar from "./UI/Avatar";

const ProgressBar = lazy(() => import("./UI/ProgressBar"));
const MbCounter = lazy(() => import("./UI/MbCounter"));

const Main = () => {
    return (
        <main className="home-main">
            <Helmet>
                <link rel="preload" as="image" href={avatar} />
                <meta name="description" content="Нажимай на своего Аватара, копи MB, играй в удовольствие" />
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