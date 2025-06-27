import axios from "axios";
import { API_BASE_URL } from "../config/api";
import useMbStore from "../store/mb-store";

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

export const updatePlayer = async (documentId, fields = {}) => {
  return axios.put(`${API_BASE_URL}/players/${documentId}`, {
    data: fields,
  });
};

export const createPlayer = async (playerData) => {
  return axios.post(`${API_BASE_URL}/players`, {
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
    await updatePlayerWithFallback(documentId, fields);
  } catch (err) {
    console.error("❌ Ошибка при повторной попытке обновления:", err);
  }
};

export const fetchDashboardPlayers = async () => {
  const res = await axios.get(`${API_BASE_URL}/players?sort=clicks:desc&pagination[limit]=3`);
  return res.data?.data;;
}

export const fetchAllPlayers = async () => {
  let page = 1;
  const pageSize = 100;
  let allPlayers = [];
  let totalPages = 1;

  do {
    const res = await axios.get(`${API_BASE_URL}/players`, {
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
  const res = await axios.get(`${API_BASE_URL}/players`, {
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
  const response = await axios.patch(`${API_BASE_URL}/players/${referrerId}/invited_friends`, {
    friend_id: invitedId,
  });
  return response.data?.data;
};

export const fetchPlayerWithFriends = async (telegram_id) => {
  const res = await axios.get(`${API_BASE_URL}/players`, {
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

export const updateReferralBonus = async (telegramId) => {
  const { setMbCountAll } = useMbStore.getState();
  const { player, setPlayer } = usePlayerData.getState();

  // Получаем игрока с invited_friends и invited_by
  const playerData = await fetchPlayerByTelegramId(telegramId);
  if (!playerData) return;

  const playerId = playerData.documentId;
  const fields = playerData;

  const invited_by = fields.invited_by?.data;
  const invited_friends = fields.invited_friends?.data || [];
  const alreadyBonusedIds = fields.invited_friends_id || [];

  let bonus = 0;
  const updatedFields = {};

  // 🎁 Бонус за то, что игрок был приглашён
  if (invited_by && !fields.referal_bonus_given) {
    bonus += 2500;
    updatedFields.referal_bonus_given = true;
  }

  // 🎁 Бонус за приглашённых друзей
  const newFriends = invited_friends.filter(friend => {
    const friendId = friend.documentId;
    return !alreadyBonusedIds.includes(friendId);
  });

  if (newFriends.length > 0) {
    bonus += 2500 * newFriends.length;
    updatedFields.invited_friends_id = [
      ...alreadyBonusedIds,
      ...newFriends.map(f => f.id),
    ];
  }

  if (bonus > 0) {
    const newMbCount = (mbCountAll || 0) + bonus;
    setMbCountAll(newMbCount);

    await updatePlayer(playerId, updatedFields);
    setPlayer({
      ...player,
      ...fields,
      ...updatedFields,
    });

    console.log("🎉 Бонус начислен:", bonus);
  }
};
