import logo from "../../../assets/icons/logo.svg";
import exchange from "../../../assets/icons/exchange.svg";
import exchange1 from "../../../assets/icons/exchange1.svg";

import useMbStore from "../../../store/mb-store.js";
import usePlayerData from '../../../hooks/usePlayerData.js'
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { animate } from "framer-motion";

const MbCounter = () => {
  const { player } = usePlayerData();
  const mbCountAll = useMbStore((state) => state.mbCountAll);
  const [animatedCount, setAnimatedCount] = useState(player?.clicks ?? 0);

  const navigate = useNavigate();
  const prevCountRef = useRef(mbCountAll); 

  useEffect(() => {
    if (prevCountRef.current === mbCountAll) return;

    const controls = animate(prevCountRef.current, mbCountAll, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        setAnimatedCount(Math.round(latest));
      },
    });

    prevCountRef.current = mbCountAll; // обновляем предыдущее значение
    return () => controls.stop();
  }, [mbCountAll]);

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
      <p>МЕГАБАЙТ</p>
    </div>
  );
};

export default MbCounter;
