import { useState, useRef, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

import avatar from "../../../assets/images/avatar.webp";
import useMbStore from "../../../store/mb-store";
import usePlayerData from "../../../hooks/usePlayerData";
import { updatePlayer } from "../../../services/playerService";

import "../home-page.css";

const Avatar = () => {
  const increment = useMbStore((state) => state.increment);
  const getMbIncrement = useMbStore((state) => state.getMbIncrement);
  const clicks = useMbStore((state) => state.mbCountAll);
  const progressTokens = useMbStore((state) => state.progressTokens);
  const { player } = usePlayerData();

  const [popups, setPopups] = useState([]);

  // ⏱ Дебаунс сохранения (300мс после последнего вызова)
  const debouncedSave = useMemo(() => debounce(async () => {
    if (!player?.documentId) return;

    try {
      console.log("✅ Сохраняю в Strapi...");
      await updatePlayer(player.documentId, {
        clicks,
        progress_tokens: progressTokens,
      });
      console.log("✅ Данные сохранены");
    } catch (err) {
      console.error("❌ Ошибка сохранения в Strapi:", err);
    }
  }, 300), [player?.documentId, clicks, progressTokens]);

  const handleClick = (e) => {
    increment();
    const mbIncrement = getMbIncrement();

    // 💬 Анимация +X
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

    // 💾 Сохраняем прогресс с задержкой
    debouncedSave();
  };

  // 🧹 Очистка при размонтировании (debounce)
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

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
            position: "absolute",
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
