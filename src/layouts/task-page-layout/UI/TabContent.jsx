import { lazy } from "react";

const Button = lazy(() => import('./Button'));

const TabContent = ({ tasks }) => {
    return (
        <div className="tabs">
            {tasks.map((task, index) => (
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

export default TabContent;
