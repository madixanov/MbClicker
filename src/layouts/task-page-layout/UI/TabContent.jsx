import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";

const Button = lazy(() => import('./Button'));

const TabContent = () => {
    const [ tasks, setTasks ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const { player } = usePlayerData();

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
                        <Button task={task} clicks={player.clicks} playerId={player.documentId}/>
                </div>
            ))}
        </div>
    );
};

export default TabContent;
