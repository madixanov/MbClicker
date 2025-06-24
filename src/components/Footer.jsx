import { lazy, Suspense, useEffect, useRef, useState } from "react";
import useModalStore from "../store/modal-store";
import './footer.css';
import ModalContainer from './UI/ModalContainer';
import ModalOverlay from './UI/ModalOverlay';

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
                {isModalDayOpen && (
                    <ModalContainer
                        title="СУТКИ, ДНИ, ЧАСЫ"
                        content={<p>ЧЕМ БОЛЬШЕ ДНЕЙ ТЕМ БОЛЬШЕ БОНУСОВ</p>}
                        onClose={() => setModalDay(false)}
                        className={isModalDayOpen ? 'hide' : 'show'}
                    />
                )}
                {isModalThemeOpen && (
                    <ModalContainer
                        title="СВЕТЛАЯ ТЕМА"
                        content={<p>ПОКА НЕДОСТУПНО.</p>}
                        onClose={() => setModalTheme(false)}
                        className={isModalThemeOpen ? 'hide' : 'show'}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default Footer;
