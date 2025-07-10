import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks, fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";
import PageLoading from "../../../pages/PageLoading";

const Button = lazy(() => import("./Button"));

const TabContent = ({ loading, setLoading }) => {
  const [tasks, setTasks] = useState([]);
  const [playerStrapiId, setPlayerStrapiId] = useState(null);
  const [error, setError] = useState(false);
  const { player } = usePlayerData();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskData, strapiId] = await Promise.all([
          fetchTemplateTasks(),
          fetchPlayerIdByDocumentId(player.documentId),
        ]);

        const enhancedTasks = taskData.map((task) => {
          const isClaimed = task.completedBy?.some((user) => user.id === strapiId);
          return { ...task, isClaimed };
        });

        setTasks(enhancedTasks);
        setPlayerStrapiId(strapiId);
      } catch (err) {
        console.error("Ошибка при загрузке задач или игрока:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (player?.documentId) {
      loadData();
    }
  }, [player?.documentId]);

  if (loading) return <PageLoading loading={loading} />;
  if (error) return <p className="tab-status">Произошла ошибка. Пока нет заданий.</p>;
  if (!Array.isArray(tasks) || tasks.length === 0)
    return <p className="tab-status">Заданий пока нет</p>;

  return (
    <div className="tabs">
      {tasks.map((task) => (
        <div className="task-container" key={task.id}>
          <div className="task-info">
            <div className="pfphoto"></div>
            <div className="task-content">
              <p className="task-name">{task.Name}</p>
              <p className="task-prize">+ {task.Prize} КБ</p>
            </div>
          </div>

          {task.taskLink ? (
            <a
              href={task.taskLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", width: "30px", height: "30px" }}
            >
              <Button
                task={task}
                playerId={player.documentId}
                strapiPlayerId={playerStrapiId}
                isClaimed={task.isClaimed}
              />
            </a>
          ) : (
            <Button
              task={task}
              playerId={player.documentId}
              strapiPlayerId={playerStrapiId}
              isClaimed={task.isClaimed}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TabContent;
