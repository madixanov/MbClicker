import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks } from "../../../services/taskService";

const Button = lazy(() => import('./Button'));

const TabContent = () => {
    const [ tasks, setTasks ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTemplateTasks();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [])

    return (
        <div className="tabs">
            {loading ? <p>Loading tasks...</p> : tasks.map((task) => (
                <div className="task-container" key={task.documentId}>
                    <div className="pfphoto"></div>
                    <div className="task-content">
                        <p className="task-name">{task.Name}</p>
                        <p className="task-prize">+ {task.Prize} Bytes</p>
                    </div>
                        <Button />
                </div>
            ))}
        </div>
    );
};

export default TabContent;
