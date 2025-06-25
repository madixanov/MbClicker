import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks, fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";
import LoadingPage from "../../../pages/LoadingPage";

const Button = lazy(() => import('./Button'));

const TabContent = () => {
  const [tasks, setTasks] = useState([]);
  const [playerStrapiId, setPlayerStrapiId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { player } = usePlayerData();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем игрока и задачи
        const [taskData, strapiId] = await Promise.all([
          fetchTemplateTasks(),
          fetchPlayerIdByDocumentId(player.documentId),
        ]);

        // Добавляем поле `isClaimed` в каждую задачу
        const enhancedTasks = taskData.map(task => {
          const isClaimed = task.completedBy?.some(user => user.id === strapiId);
          return { ...task, isClaimed };
        });

        setTasks(enhancedTasks);
        setPlayerStrapiId(strapiId);
      } catch (err) {
        console.error("Ошибка при загрузке задач или игрока:", err);
      } finally {
        setLoading(false);
      }
    };

    if (player?.documentId) {
      loadData();
    }
  }, [player?.documentId]);

  if (loading || !playerStrapiId) {
    return <LoadingPage />;
  }

  return (
    <div className="tabs">
      {tasks.map((task) => (
        <div className="task-container" key={task.id}>
          <div className="pfphoto"></div>
          <div className="task-content">
            <p className="task-name">{task.Name}</p>
            <p className="task-prize">+ {task.Prize} КБ</p>
          </div>
          <Button
            task={task}
            playerId={player.documentId}
            strapiPlayerId={playerStrapiId}
            isClaimed={task.isClaimed} // ✅ передаём статус
          />
        </div>
      ))}
    </div>
  );
};

export default TabContent;
