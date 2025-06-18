import { lazy, useMemo, memo } from "react";

const Button = lazy(() => import('./Button'));

const TabContent = ({ tasks }) => {

    const memoizedTasks = useMemo(() => tasks, [])

    return (
        <div className="tabs">
            {memoizedTasks.map((task, index) => (
                <div className="task-container" key={index}>
                    <div className="pfphoto"></div>
                    <div className="task-content">
                        <p className="task-name">{task.name}</p>
                        <p className="task-prize">{task.prize}</p>
                    </div>
                        <Button />
                </div>
            ))}
        </div>
    );
};

export default memo(TabContent);
