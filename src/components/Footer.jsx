import { lazy, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useModalStore from "../store/modal-store";
import './footer.css'

const RouterIcon = lazy(() => import("./UI/RouterIcon"));
const ModalContainer = lazy(() => import("./UI/ModalContainer"));
const ModalOverlay = lazy(() => import("./UI/ModalOverlay"));

const modalAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.25 }
    };

const Footer = () => {
    const isModalDayOpen = useModalStore(state => state.isModalDayOpen);
    const isModalThemeOpen = useModalStore(state => state.isModalThemeOpen);
    const setModalDay = useModalStore(state => state.setModalDay);
    const setModalTheme = useModalStore(state => state.setModalTheme)

    useEffect(() => {
        const footer = document.querySelector('.footer-container');
        const initialHeight = window.innerHeight;

        const handleResize = () => {
            if (window.innerHeight < initialHeight - 100) {
            footer.style.display = 'none';
            } else {
            footer.style.display = 'flex';
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className="footer-container">
        <RouterIcon />
        <ModalOverlay />
        <AnimatePresence>
            {isModalDayOpen && (
            <motion.div
                className="modal-container"
                {...modalAnimation}
                key="modal-day"
            >
                <ModalContainer
                title="СУТКИ, ДНИ, ЧАСЫ"
                content={<p>ЧЕМ БОЛЬШЕ ДНЕЙ ТЕМ БОЛЬШЕ БОНУСОВ</p>}
                closeModal={() => setModalDay(false)}
                />
            </motion.div>
            )}

            {isModalThemeOpen && (
            <motion.div
                className="modal-container"
                {...modalAnimation}
                key="modal-theme"
            >
                <ModalContainer
                title="СВЕТЛАЯ ТЕМА"
                content={<p>ПОКА НЕДОСТУПНО.</p>}
                closeModal={() => setModalTheme(false)}
                />
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
};

export default Footer;
