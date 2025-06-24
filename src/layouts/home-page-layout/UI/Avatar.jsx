import { useState } from "react";
import avatar from "../../../assets/images/avatar.webp";
import useMbStore from "../../../store/mb-store";
import "../home-page.css"; // подключим стили анимации

const Avatar = () => {
  const increment = useMbStore((state) => state.increment);
  const getMbIncrement = useMbStore((state) => state.getMbIncrement);
  const [popups, setPopups] = useState([]);

  const handleClick = (e) => {
    increment();
    const mbIncrement = getMbIncrement();

    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    const id = Date.now();

    const newPopup = {
      id,
      x,
      y,
      text: `+ ${mbIncrement}`,
    };

    setPopups((curr) => [...curr, newPopup]);

    setTimeout(() => {
      setPopups((curr) => curr.filter((p) => p.id !== id));
    }, 1200);
  };

  return (
    <div
      className="avatar-container"
      onClick={handleClick}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        overflow: "visible",
        zIndex: 0,
      }}
    >
      <img
        src={avatar}
        alt="Avatar"
        width="300"
        height="300"
        loading="eager"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          userSelect: "none",
          aspectRatio: "3 / 5",
        }}
      />

      {popups.map((popup) => (
        <div
          key={popup.id}
          className="popup-text"
          style={{
            left: popup.x,
            top: popup.y,
          }}
        >
          {popup.text}
        </div>
      ))}
    </div>
  );
};

export default Avatar;
