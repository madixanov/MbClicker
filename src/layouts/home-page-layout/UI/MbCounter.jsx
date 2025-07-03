import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { animate } from "framer-motion";

import logo from "../../../assets/icons/logo.svg";
import exchange from "../../../assets/icons/exchange.svg";
import exchange1 from "../../../assets/icons/exchange1.svg";

import useMbStore from "../../../store/mb-store";
import usePlayerData from "../../../hooks/usePlayerData";
import useUpdatePlayer from "../../../hooks/useUpdatePlayer";
import useLvlStore from "../../../store/lvl-store";

const MbCounter = () => {
  const { player } = usePlayerData();
  const updatePlayer = useUpdatePlayer();
  const mbCountAll = useMbStore((state) => state.mbCountAll);
  const progressTokens = useMbStore((state) => state.progressTokens);
  const lvl = useLvlStore((state) => state.level);

  const [animatedCount, setAnimatedCount] = useState(mbCountAll);
  const prevCountRef = useRef(mbCountAll);
  const navigate = useNavigate();

  // 🎞 Анимация при изменении счётчика
  useEffect(() => {
    if (prevCountRef.current === mbCountAll) return;

    const controls = animate(prevCountRef.current, mbCountAll, {
      duration: 0.3,
      ease: "easeOut",
      onUpdate: (latest) => {
        setAnimatedCount(Math.round(latest));
      },
    });

    prevCountRef.current = mbCountAll;
    return () => controls.stop();
  }, [mbCountAll]);

  // ⏳ Автосохранение в Strapi раз в 15 секунд
  useEffect(() => {
    if (!player?.documentId) return;

    const interval = setInterval(() => {
      updatePlayer({
        clicks: mbCountAll,
        progress_tokens: progressTokens,
        level: lvl
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [mbCountAll, progressTokens, player?.documentId]);

  // ✅ Пересинхронизация animatedCount после обнуления
  useEffect(() => {
    if (mbCountAll === 0 && animatedCount !== 0) {
      setAnimatedCount(0);
      prevCountRef.current = 0;
    }
  }, [mbCountAll]);

  // 🔁 Переход на страницу обмена
  const handleClick = () => navigate("/exchange");

  return (
    <div className="mb-counter-container select-none">
      <div className="mb-counter">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h1>{animatedCount.toLocaleString("ru-RU")}</h1>
        <div className="exchange" onClick={handleClick}>
          <img src={exchange} alt="exchange icon" className="exchange-icon" />
          <img src={exchange1} alt="exchange icon" className="exchange-icon" />
        </div>
      </div>
      <p>КИЛОБАЙТ</p>
    </div>
  );
};

export default MbCounter;
