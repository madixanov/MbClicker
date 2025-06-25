import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks, fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";

const Button = lazy(() => import('./Button'));

const TabContent = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerStrapiId, setPlayerStrapiId] = useState(null);
    const { player } = usePlayerData();

    useEffect(() => {
        const load = async () => {
        try {
            const taskData = await fetchTemplateTasks();
            setTasks(taskData);

            const id = await fetchPlayerIdByDocumentId(player.documentId);
            setPlayerStrapiId(id);
        } catch (err) {
            console.error("Ошибка при загрузке задач или игрока:", err);
        } finally {
            setLoading(false);
        }
        };

        if (player?.documentId) {
        load();
        }
    }, [player?.documentId]);

    return (
        <div className="tabs">
        {loading ? (
            <p>Загрузка...</p>
        ) : (
            tasks.map((task) => {
            const alreadyCompleted = task.completedBy?.some(
                (user) => user.id === playerStrapiId
            );

            return (
                <div className="task-container" key={task.id}>
                <div className="pfphoto"></div>
                <div className="task-content">
                    <p className="task-name">{task.Name}</p>
                    <p className="task-prize">+ {task.Prize} Bytes</p>
                </div>

                {alreadyCompleted ? (
                    <span className="task-done">✅ ВЫПОЛНЕНО</span>
                ) : (
                    <Button
                    task={task}
                    clicks={player.clicks}
                    level={player.level}
                    playerId={player.documentId}
                    />
                )}
                </div>
            );
            })
        )}
    </div>
    );
};

export default TabContent;
