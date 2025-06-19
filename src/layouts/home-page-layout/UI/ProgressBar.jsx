import { useEffect } from "react";
import useMbStore from "../../../store/mb-store";
import click from "../../../assets/icons/click.svg";
import useLvlStore from "../../../store/lvl-store";
import usePlayerData from "../../../hooks/usePlayerData";

const ProgressBar = () => {
    const { player } = usePlayerData();
    const progress = useMbStore((state) => state.mbCount);
    const incrementMbInc = useMbStore((state) => state.incrementMbInc);
    const resetCount = useMbStore((state) => state.resetCount);

    const level = useLvlStore((state) => state.level);
    const points = useLvlStore((state) => state.points);
    const upgradeLevel = useLvlStore((state) => state.upgradeLevel);
    const upgradePoints = useLvlStore((state) => state.upgradePoints);

    // Когда progress >= points → апгрейд и сброс
    useEffect(() => {
        if (progress >= points) {
        upgradeLevel();
        upgradePoints();
        resetCount();     
        incrementMbInc();
        }
    }, [progress, points]);

    const progressPercent = Math.min(Math.max((progress / points) * 100, 0), 100);

    return (
        <div className="progress-bar-container">
        <div className="lvl">
            <span>{player.level} LVL</span>
            <div className="progress-bar">
            <div className="progress-bar__wrapper">
                <div
                className="progress-bar__fill"
                style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            </div>
            <span>{player.level + 1} LVL</span>
        </div>
        <div className="target">
            <p>{`${progress.toLocaleString('ru-RU')} / ${points.toLocaleString('ru-RU')}`}</p>
            <img src={click} alt="" />
        </div>
        </div>
    );
    };

    export default ProgressBar;
