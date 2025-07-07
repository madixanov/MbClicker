import { lazy, Suspense } from "react";
import './home-page.css';
import { Helmet } from "react-helmet";
import avatar from '../../assets/images/avatar.webp';

const ProgressBar = lazy(() => import("./UI/ProgressBar"));
const MbCounter = lazy(() => import("./UI/MbCounter"));

const Main = () => {
    return (
        <main className="home-main">
            <Helmet>
                <link rel="preload" as="image" href={avatar} type="image/webp" />
                <meta name="description" content="Нажимай на своего Аватара, копи MB, играй в удовольствие" />
            </Helmet>

            <ProgressBar />
            <MbCounter />
            <Avatar />
        </main>
    )
}

export default Main;