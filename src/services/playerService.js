import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useEffect } from "react";
import useMbStore from "../store/mb-store";

export const fetchPlayerByTelegramId = async (telegram_id) => {
  console.log("fetchPlayerByTelegramId вызван", telegram_id)
  console.trace('Trace: ')
  const res = await axios.get(`${API_BASE_URL}/api/players`, {
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

export const updatePlayer = async (documentId, fields = {}) => {
  return axios.put(`${API_BASE_URL}/api/players/${documentId}`, {
    data: fields,
  });
};

export const createPlayer = async (playerData) => {
  return axios.post(`${API_BASE_URL}/api/players`, {
    data: playerData,
  });
};

// ✅ Отложенное обновление при offline/ошибке
export const updatePlayerWithFallback = async (documentId, fields = {}) => {
  try {
    await updatePlayer(documentId, fields);
    console.log("✅ Обновлено:", fields);
    localStorage.removeItem("pendingUpdate");
  } catch (err) {
    console.warn(`⚠️ Ошибка при обновлении: ${err}. Сохраняем в очередь: ${fields}`);
    localStorage.setItem(
      "pendingUpdate",
      JSON.stringify({ documentId, fields })
    );
  }
};

// ✅ Повторная попытка при запуске
export const retryPendingUpdate = async () => {
  const item = localStorage.getItem("pendingUpdate");
  if (!item) return;

  try {
    const { documentId, fields } = JSON.parse(item);
    await updatePlayer(documentId, fields);
  } catch (err) {
    console.error("❌ Ошибка при повторной попытке обновления:", err);
  }
};

export const fetchDashboardPlayers = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/players?sort=clicks:desc&pagination[limit]=3`);
  return res.data?.data;;
}

export const fetchAllPlayers = async () => {
  let page = 1;
  const pageSize = 100;
  let allPlayers = [];
  let totalPages = 1;

  do {
    const res = await axios.get(`${API_BASE_URL}/api/players`, {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'sort[0]': 'clicks:desc',
      },
    });

    const { data, meta } = res.data;

    allPlayers.push(...data);
    totalPages = meta.pagination.pageCount;
    page++;
  } while (page <= totalPages);

  return allPlayers;
};

export const fetchPlayerByInviteCode = async (inviteCode) => {
  const res = await axios.get(`${API_BASE_URL}/api/players`, {
    params: {
      filters: {
        invite_code: {
          $eq: inviteCode,
        },
      },
      publicationState: "preview", // если ты используешь черновики
    },
  });

  return res.data?.data?.[0] || null;
};

export const addInvitedFriend = async (referrerId, invitedId) => {
  const response = await axios.patch(`${API_BASE_URL}/api/players/${referrerId}/invited_friends`, {
    friend_id: invitedId,
  });
  return response.data?.data;
};

export const fetchPlayerWithFriends = async (telegram_id) => {
  const res = await axios.get(`${API_BASE_URL}/api/players`, {
    params: {
      filters: {
        telegram_id: {
          $eq: telegram_id,
        },
      },
      populate: ["invited_friends"], // 👈 вот ключ
      publicationState: "preview",
    },
  });

  return res.data?.data?.[0] || null;
};

const giveReferralBonus = async (documentId) => {
  try {
    // Получаем текущего игрока
    const res = await axios.get(`${API_BASE_URL}/api/players`, {
      params: {
        filters: {
          documentId: { $eq: documentId },
        },
        populate: "*",
      },
    });

    const current = res.data.data[0];
    if (!current) return;

    const playerId = current.documentId;

    // Проверка: invited_by есть, бонус не выдан
    if (current.invited_by && !current.referal_bonus_given) {
      // Получаем пригласившего игрока
      const inviterRes = await axios.get(`${API_BASE_URL}/api/players`, {
        params: {
          filters: {
            documentId: { $eq: current.invited_by },
          },
        },
      });

      const inviter = inviterRes.data.data[0];
      if (!inviter) return;

      const inviterId = inviter.documentId;

      // Обновляем пригласившего
      await axios.put(`${API_BASE_URL}/api/players/${inviterId}`, {
        data: {
          clicks: (inviter.clicks || 0) + 2500,
        },
      });

      // Обновляем текущего игрока
      await axios.put(`${API_BASE_URL}/api/players/${playerId}`, {
        data: {
          clicks: (current.clicks || 0) + 2500,
          referal_bonus_given: true,
        },
      });
    }
  } catch (err) {
    console.error("Ошибка при начислении бонусов:", err);
  }
};

// Использовать этот хук при загрузке компонента
export const useReferralBonus = (documentId) => {
  const mbCountAll = useMbStore((state) => state.mbCountAll);
  const setMbCountAll = useMbStore((state) => state.setMbCountAll);

  useEffect(() => {
    if (documentId) {
      giveReferralBonus(documentId, () => {
        setMbCountAll(mbCountAll + 2500);
      });
    }
  }, [documentId]);
};
