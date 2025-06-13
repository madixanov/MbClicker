import { lazy } from "react";
const RouterIcon = lazy(() => import("./UI/RouterIcon"))

const Footer = () => {
    return (
        <div className="footer-container">
            <RouterIcon />
        </div>
    )
}

export default Footer;