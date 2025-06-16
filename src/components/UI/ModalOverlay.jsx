import React from "react";
import useModalStore from "../../store/modal-store";
import './modal-container.css'


const ModalOverlay = () => {
  const { isModalDayOpen, isModalThemeOpen, setModalDay, setModalTheme } = useModalStore();

  const handleClose = () => {
    if (isModalDayOpen) setModalDay(false);
    if (isModalThemeOpen) setModalTheme(false);
  };

  if (!isModalDayOpen && !isModalThemeOpen) return null;

  return <div className="modal-overlay" onClick={handleClose} />;
};

export default ModalOverlay;
