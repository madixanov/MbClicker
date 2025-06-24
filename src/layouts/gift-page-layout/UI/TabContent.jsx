import { lazy, memo } from "react";
import useBonuses from "../../../hooks/useBonuses";

const Button = lazy(() => import('./Button'));

const TabContent = () => {
    const { bonuses, loading } = useBonuses();

    if (loading) return <p>Загрузка бонусов...</p>;

    if (!bonuses.length) return <p>Бонусов пока нет</p>;

    return (
        <div className="tabs">
            {bonuses.map((bonus, index) => (
                <div className="task-container" key={index}>
                    <div className="pfphoto"></div>
                    <div className="task-content">
                        <p className="task-name">{bonus.Name}</p>
                        <p className="task-prize">+ {bonus.Prize} B</p>
                    </div>
                        <Button />
                </div>
            ))}
        </div>
    );
};

export default memo(TabContent);
