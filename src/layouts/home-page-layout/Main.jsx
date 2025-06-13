import { lazy } from "react";

const ProgressBar = lazy(() => import("./UI/ProgressBar"));
const MbCounter = lazy(() => import("./UI/MbCounter"));
const Avatar = lazy(() => import("./UI/Avatar"));

const Main = () => {
    return (
        <main className="home-main">
            <ProgressBar />
            <MbCounter />
            <Avatar />
        </main>
    )
}

export default Main;