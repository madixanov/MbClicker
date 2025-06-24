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

  const [showDay, setShowDay] = useState(false);
  const [dayAnimation, setDayAnimation] = useState("");

  const [showTheme, setShowTheme] = useState(false);
  const [themeAnimation, setThemeAnimation] = useState("");

  // ⚙️ Контроль модалки "Day"
  useEffect(() => {
    if (isModalDayOpen) {
      setShowDay(true);
      setDayAnimation("show");
    } else if (showDay) {
      setDayAnimation("hide");
      setTimeout(() => setShowDay(false), 300);
    }
  }, [isModalDayOpen]);

  // ⚙️ Контроль модалки "Theme"
  useEffect(() => {
    if (isModalThemeOpen) {
      setShowTheme(true);
      setThemeAnimation("show");
    } else if (showTheme) {
      setThemeAnimation("hide");
      setTimeout(() => setShowTheme(false), 300);
    }
  }, [isModalThemeOpen]);

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
        
        {showDay && (
          <ModalContainer
            title="СУТКИ, ДНИ, ЧАСЫ"
            content={<p>ЧЕМ БОЛЬШЕ ДНЕЙ ТЕМ БОЛЬШЕ БОНУСОВ</p>}
            closeModal={() => setModalDay(false)}
            className={`modal-container ${dayAnimation}`}
          />
        )}
        {showTheme && (
          <ModalContainer
            title="СВЕТЛАЯ ТЕМА"
            content={<p>ПОКА НЕДОСТУПНО.</p>}
            closeModal={() => setModalTheme(false)}
            className={`modal-container ${themeAnimation}`}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Footer;
