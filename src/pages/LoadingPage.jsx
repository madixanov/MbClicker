// src/components/LoadingPage.jsx
import { motion } from "framer-motion";
import "./loading-page.css";

const LoadingPage = () => {
    return (
        <div className="loading-wrapper">
            <motion.div
                className="loading-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1, 1.2, 1],
                }}
                transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                }}
            >
                <span>🚀</span>
            </motion.div>
            <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                }}
            >
                Загрузка...
            </motion.p>
        </div>
    );
};

export default LoadingPage;
