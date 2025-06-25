import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { animate } from "framer-motion";

import logo from "../../../assets/icons/logo.svg";
import exchange from "../../../assets/icons/exchange.svg";
import exchange1 from "../../../assets/icons/exchange1.svg";

import useMbStore from "../../../store/mb-store.js";
import usePlayerData from "../../../hooks/usePlayerData.js";
import useUpdatePlayer from "../../../hooks/useUpdatePlayer";

const MbCounter = () => {
  const { player } = usePlayerData();
  const updatePlayer = useUpdatePlayer();
  const mbCountAll = useMbStore((state) => state.mbCountAll);

  const [animatedCount, setAnimatedCount] = useState(player?.clicks ?? mbCountAll);
  const prevCountRef = useRef(mbCountAll);
  const navigate = useNavigate();

  // 🎞 Анимация при клике
  useEffect(() => {
    if (prevCountRef.current === mbCountAll) return;

    const controls = animate(prevCountRef.current, mbCountAll, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        setAnimatedCount(Math.round(latest));
      },
    });

    prevCountRef.current = mbCountAll;
    return () => controls.stop();
  }, [mbCountAll]);

  // ⏳ Обновление в Strapi — раз в 15 секунд
  useEffect(() => {
    if (!player || !player.documentId) return;

    const interval = setInterval(() => {
      updatePlayer({ 
        clicks: mbCountAll,
        progress_tokens: useMbStore.getState().progressTokens
      });
    }, 15000); // ⏱️ раз в 15 сек

    return () => clearInterval(interval); // очищаем при размонтировании
  }, [mbCountAll, player?.documentId]);

  // 🔁 Навигация
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
      <p>БАЙТ</p>
    </div>
  );
};

export default MbCounter;
