import { lazy, Suspense, useEffect, useRef } from "react";
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
      footer.style.display = window.innerHeight < initialHeight - 100 ? 'none' : 'flex';
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
          <CssModal
            title="СУТКИ, ДНИ, ЧАСЫ"
            content="ЧЕМ БОЛЬШЕ ДНЕЙ ТЕМ БОЛЬШЕ БОНУСОВ"
            onClose={() => setModalDay(false)}
          />
        )}
        {isModalThemeOpen && (
          <CssModal
            title="СВЕТЛАЯ ТЕМА"
            content="ПОКА НЕДОСТУПНО."
            onClose={() => setModalTheme(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

const CssModal = ({ title, content, onClose }) => {
  return (
    <div className="css-modal-overlay" onClick={onClose}>
      <div className="css-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="css-modal-close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Footer;
