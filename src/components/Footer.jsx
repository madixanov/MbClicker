.css-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.2s ease-in-out;
}

.css-modal-box {
  background-color: #1e1e1e;
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  position: relative;
  animation: scaleIn 0.3s ease-out;
  text-align: center;
}

.css-modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 20px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
