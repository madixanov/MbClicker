import { useEffect, useRef } from "react";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";
import usePlayerData from "../../../hooks/usePlayerData";

import click from "../../../assets/icons/click.svg";

const ProgressBar = () => {
  const resetCount = useMbStore((state) => state.resetCount);
  const progress = useMbStore((state) => state.progressTokens);
  const saveTokensToStrapi = useMbStore((state) => state.saveTokensToStrapi);

  const { loadPlayer } = usePlayerData();

  const level = useLvlStore((state) => state.level);
  const points = useLvlStore((state) => state.points);
  const upgradeLevel = useLvlStore((state) => state.upgradeLevel);

  const upgradedRef = useRef(false);

  const progressPercent = Math.min(Math.max((progress / points) * 100, 0), 100);

  // ⏱ Автосохранение и синхронизация с сервером
  useEffect(() => {
    const interval = setInterval(async () => {
      await saveTokensToStrapi(); // сохраняем прогресс
      await loadPlayer();         // загружаем обновлённые данные
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // ⬆ Проверка достижения уровня
  useEffect(() => {
    if (progress >= points && !upgradedRef.current) {
      upgradedRef.current = true;
      upgradeLevel();
      resetCount(); // сброс токенов
    } else if (progress < points) {
      upgradedRef.current = false;
    }
  }, [progress, points]);

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
