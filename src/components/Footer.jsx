import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useModalStore from "../store/modal-store";
import './footer.css'
import ModalContainer from './UI/ModalContainer'
import ModalOverlay from './UI/ModalOverlay'


const RouterIcon = lazy(() => import("./UI/RouterIcon"));

const Footer = () => {
    const isModalDayOpen = useModalStore(state => state.isModalDayOpen);
    const isModalThemeOpen = useModalStore(state => state.isModalThemeOpen);
    const setModalDay = useModalStore(state => state.setModalDay);
    const setModalTheme = useModalStore(state => state.setModalTheme);

    const footerRef = useRef(null);

    useEffect(() => {
        const footer = footerRef.current;
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
        <div className="footer-container" ref={footerRef}>
            <Suspense fallback={null}>
                <RouterIcon />
                <ModalOverlay />
                <AnimatePresence>
                    {isModalDayOpen && (
                        <AnimatedModal
                        modalKey="modal-day"
                        title="СУТКИ, ДНИ, ЧАСЫ"
                        content={<p>ЧЕМ БОЛЬШЕ ДНЕЙ ТЕМ БОЛЬШЕ БОНУСОВ</p>}
                        onClose={() => setModalDay(false)}
                        />
                    )}
                    {isModalThemeOpen && (
                        <AnimatedModal
                        modalKey="modal-theme"
                        title="СВЕТЛАЯ ТЕМА"
                        content={<p>ПОКА НЕДОСТУПНО.</p>}
                        onClose={() => setModalTheme(false)}
                        />
                    )}
                </AnimatePresence>
            </Suspense>
        </div>
    );
};

const AnimatedModal = ({ title, content, onClose, modalKey }) => {

    const modalAnimation = {
        initial: { opacity: 0, clipPath: 'inset(100% 100% 0% 100%)' },
        animate: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        transition: { duration: 0.3, ease: 'easeOut' }
    };

    return (
        <motion.div className="modal-container" {...modalAnimation} key={modalKey} layout>
            <ModalContainer title={title} content={content} closeModal={onClose} />
        </motion.div>
    );
    }

export default Footer;
