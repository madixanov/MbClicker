import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const referralBonus = async (documentId, onLocalBonus) => {
  if (!documentId) return;

  try {
    const res = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        filters: { documentId: { $eq: documentId } },
        populate: "*",
      },
    });

    const current = res.data.data[0];
    if (!current) return;

    const playerId = current.documentId;

    if (current.invited_by && !current.referal_bonus_given) {
      const inviterRes = await axios.get(`${API_BASE_URL}/players`, {
        params: {
          filters: { documentId: { $eq: current.invited_by } },
        },
      });

      const inviter = inviterRes.data.data[0];
      if (!inviter) return;

      const inviterId = inviter.documentId;

      await axios.put(`${API_BASE_URL}/players/${inviterId}`, {
        data: {
          clicks: (inviter.clicks || 0) + 2500,
        },
      });

      await axios.put(`${API_BASE_URL}/players/${playerId}`, {
        data: {
          clicks: (current.clicks || 0) + 2500,
          referal_bonus_given: true,
        },
      });

      if (onLocalBonus) onLocalBonus(); // обновление Zustand
    }
  } catch (err) {
    console.error("Ошибка при начислении бонусов:", err);
  }
};
