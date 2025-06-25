import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks, fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";
import completed from "../../../assets/icons/completed.svg";

const Button = lazy(() => import('./Button'));

const TabContent = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerStrapiId, setPlayerStrapiId] = useState(null);
    const { player } = usePlayerData();

    useEffect(() => {
        const refreshTasks = async () => {
            try {
            const updatedTasks = await fetchTemplateTasks();
            setTasks(updatedTasks);
            } catch (err) {
            console.error("Ошибка при обновлении задач:", err);
            }
        };

        // 🔁 Загружаем задачи, когда меняется количество кликов
        if (player?.clicks && playerStrapiId) {
            refreshTasks();
        }
        }, [player?.clicks, playerStrapiId]);

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
                    <p className="task-prize">+ {task.Prize} КБ</p>
                </div>

                {alreadyCompleted ? (
                    <span className="task-done">
                        <img src={completed} alt="" />
                    </span>
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
