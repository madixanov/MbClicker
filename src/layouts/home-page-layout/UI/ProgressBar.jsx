import { useEffect } from "react";
import useMbStore from "../../../store/mb-store";
import useLvlStore from "../../../store/lvl-store";

import click from "../../../assets/icons/click.svg";

const ProgressBar = () => {
  const progress = useMbStore((state) => state.mbCount);
  const incrementMbInc = useMbStore((state) => state.incrementMbInc);
  const resetCount = useMbStore((state) => state.resetCount);

  const level = useLvlStore((state) => state.level);
  const points = useLvlStore((state) => state.points);
  const upgradeLevel = useLvlStore((state) => state.upgradeLevel);

  useEffect(() => {
    if (progress >= points) {
      upgradeLevel();     // ✅ теперь сохраняет и в Strapi
      resetCount();
      incrementMbInc();
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
