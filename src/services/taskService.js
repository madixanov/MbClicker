import axios from "axios";
import { API_BASE_URL } from "../config/api";

// 🔹 Получение всех шаблонных задач
export const fetchTemplateTasks = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/tasks?filters[isTemplate][$eq]=true&populate=completedBy`);
  return res.data.data;
};

// 🔹 Получить Strapi ID игрока по его documentId
export const fetchPlayerIdByDocumentId = async (documentId) => {
  const res = await axios.get(`${API_BASE_URL}/api/players?filters[documentId][$eq]=${documentId}`);
  return res.data.data[0]?.id || null;
};

// 🔹 Получить Strapi ID задачи по её documentId
export const fetchTaskIdByDocumentId = async (documentId) => {
  const res = await axios.get(`${API_BASE_URL}/api/tasks?filters[documentId][$eq]=${documentId}`);
  return res.data.data[0]?.id || null;
};

// 🔹 Обновить задачу, добавив игрока в completedBy
export const completeTask = async (taskId, playerId) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, {
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

export const updatePlayerClicks = async (playerId, newClicks) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/players/${playerId}`, {
      data: {
        clicks: newClicks,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Ошибка при обновлении кликов игрока:", err.response?.data || err);
    throw err;
  }
};
