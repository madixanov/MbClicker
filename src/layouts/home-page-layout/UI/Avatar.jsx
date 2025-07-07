import { useState, useRef, useEffect } from "react";
import avatar from "../../../assets/images/avatar.webp";
import useMbStore from "../../../store/mb-store";
import usePlayerData from "../../../hooks/usePlayerData";
import { updatePlayer } from "../../../services/playerService"; // <-- Добавь это
import "../home-page.css";
import useLvlStore from "../../../store/lvl-store";

const Avatar = () => {
  const { mbCountAll, progressTokens, increment, getMbIncrement, startSavingAvatar, stopSavingAvatar } = useMbStore.getState();
  const lvl = useLvlStore.getState().level;
  const { player } = usePlayerData(); // получаем Telegram ID
  const [popups, setPopups] = useState([]);

  const saveTimeoutRef = useRef(null);
  const SAVE_DELAY = 1000;

  const saveToStrapi = async () => {
    if (!player || !player.documentId) return;
    try {
      startSavingAvatar();
      console.log("Сохранение данных в Strapi...");
      await updatePlayer(player.documentId, {
        clicks: mbCountAll,
        progress_tokens: progressTokens, // если нужно
        level: lvl,
      });
      console.log("Данные сохранены в Strapi");
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    } finally {
      stopSavingAvatar();
    }
  };

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

    // ⛔️ Очищаем предыдущий таймер
    clearTimeout(saveTimeoutRef.current);

    // ✅ Ставим новый таймер на 3 секунды
    saveTimeoutRef.current = setTimeout(() => {
      console.log("⏳ Таймер истёк, сохраняем...");
      saveToStrapi();
      saveTimeoutRef.current = null; // сбрасываем
    }, SAVE_DELAY);
  };

  useEffect(() => {
    return () => clearTimeout(saveTimeoutRef.current); // очистка при размонтировании
  }, []);

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
        decoding="async"
        fetchPriority="high"
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
