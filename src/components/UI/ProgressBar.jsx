import useMbStore from "../../store/mb-store";
import click from "../../assets/icons/click.png"

const ProgressBar = () => {
    const progress = useMbStore((state) => state.mbCount);

    const progressPercent = Math.min(Math.max((progress / 1024) * 100, 0), 100);

    return (
        <div className="progress-bar-container">
            <div className="lvl">
                <span>1 LVL</span>
                <div className="progress-bar">
                    <div className="progress-bar__wrapper">
                        <div
                            className="progress-bar__fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
                <span>2 LVL</span>
            </div>
            <div className="target">
                <p>{`${progress}/1024`}</p>
                <img src={click} alt="" />
            </div>
        </div>
    );
};

export default ProgressBar;
