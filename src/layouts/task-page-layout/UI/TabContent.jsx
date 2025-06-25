import { lazy, useEffect, useState } from "react";
import { fetchTemplateTasks, fetchPlayerIdByDocumentId } from "../../../services/taskService";
import usePlayerData from "../../../hooks/usePlayerData";
import LoadingPage from "../../../pages/LoadingPage";

const Button = lazy(() => import('./Button'));

const TabContent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerStrapiId, setPlayerStrapiId] = useState(null);
  const [readyTaskCount, setReadyTaskCount] = useState(0);
  const { player } = usePlayerData();

  const isFullyReady = !loading && tasks.length > 0 && readyTaskCount === tasks.length;

  useEffect(() => {
    const refreshTasks = async () => {
      try {
        const updatedTasks = await fetchTemplateTasks();
        setTasks(updatedTasks);
      } catch (err) {
        console.error("Ошибка при обновлении задач:", err);
      }
    };

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

  if (!isFullyReady) {
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
            clicks={player.clicks}
            playerId={player.documentId}
            onReady={() => setReadyTaskCount((prev) => prev + 1)}
          />
        </div>
      ))}
    </div>
  );
};

export default TabContent;
