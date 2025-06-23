import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const fetchPlayerByTelegramId = async (telegram_id) => {
  const res = await axios.get(`${API_BASE_URL}/players`, {
    params: {
      filters: {
        telegram_id: {
          $eq: telegram_id,
        },
      },
      publicationState: "preview",
    },
  });

  return res.data?.data?.[0] || null;
};

export const updatePlayerLevel = async (documentId, level) => {
  return axios.put(`${API_BASE_URL}/players/${documentId}`, {
    data: { level },
  });
};

export const updatePlayerClicks = async (documentId, clicks) => {
  return axios.put(`${API_BASE_URL}/players/${documentId}`, {
    data: { clicks },
  });
};

export const createPlayer = async (playerData) => {
  return axios.post(`${API_BASE_URL}/players`, {
    data: playerData,
  });
};