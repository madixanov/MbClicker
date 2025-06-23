import { useEffect, useRef } from "react";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";
import usePlayerData from "../../../hooks/usePlayerData";

import click from "../../../assets/icons/click.svg";

const ProgressBar = () => {
  const resetCount = useMbStore((state) => state.resetCount);
  const { player } = usePlayerData();
  const progress = Number(player.progress_tokens);

  const level = useLvlStore((state) => state.level);
  const points = useLvlStore((state) => state.points);
  const upgradeLevel = useLvlStore((state) => state.upgradeLevel);

  const upgradedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      useMbStore.getState().saveTokensToStrapi();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= points && !upgradedRef.current) {
      upgradedRef.current = true;
      upgradeLevel();     // ⬆ повысили уровень и сохранили в Strapi
      resetCount();       // 🔁 сброс прогресса
    } else if (progress < points) {
      upgradedRef.current = false; // сброс флага, когда пользователь ещё не достиг нового уровня
    }
  }, [progress, points]);

  const progressPercent = Math.min(Math.max((progress / points) * 100, 0), 100);

  return (
    <div className="progress-bar-container">
      <div className="lvl">
        <span>{level} LVL</span>
        <div className="progress-bar">
          <div className="progress-bar__wrapper">
            <div
              className="progress-bar__fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <span>{level + 1} LVL</span>
      </div>
      <div className="target">
        <p>{`${progress.toLocaleString("ru-RU")} / ${points.toLocaleString("ru-RU")}`}</p>
        <img src={click} alt="click icon" />
      </div>
    </div>
  );
};

export default ProgressBar;
