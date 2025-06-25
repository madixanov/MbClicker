import axios from "axios";

const API = "https://mbclickerstrapi.onrender.com/api";

// 🔹 Получение всех шаблонных задач
export const fetchTemplateTasks = async () => {
  const res = await axios.get(`${API}/tasks?filters[isTemplate][$eq]=true&populate=completedBy`);
  return res.data.data;
};

// 🔹 Получить Strapi ID игрока по его documentId
export const fetchPlayerIdByDocumentId = async (documentId) => {
  const res = await axios.get(`${API}/players?filters[documentId][$eq]=${documentId}`);
  return res.data.data[0]?.id || null;
};

// 🔹 Получить Strapi ID задачи по её documentId
export const fetchTaskIdByDocumentId = async (documentId) => {
  const res = await axios.get(`${API}/tasks?filters[documentId][$eq]=${documentId}`);
  return res.data.data[0]?.id || null;
};

// 🔹 Обновить задачу, добавив игрока в completedBy
export const completeTask = async (taskId, playerId) => {
  try {
    const res = await axios.put(`${API}/tasks/${taskId}`, {
      data: {
        completedBy: [playerId], // ✅ массив ID
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Ошибка при завершении задачи:", err.response?.data || err.message);
    throw err;
  }
};
