// services/taskService.js
import axios from "axios";

export const fetchTemplateTasks = async () => {
  const res = await axios.get(
    "https://mbclickerstrapi.onrender.com/api/tasks?filters[isTemplate][$eq]=true"
  );
  return res.data.data; // данные уже плоские, ничего разворачивать не нужно
};

export const completeTask = async (taskId, playerId) => {
  try {
    const res = await axios.put(`https://mbclickerstrapi.onrender.com/api/tasks/${taskId}`, {
      data: {
        completedBy: {
          connect: [{ id: playerId }],
        },
      },
    });
    return res.data;
  } catch (err) {
    console.error("Ошибка при завершении задачи:", err);
    throw err;
  }
};