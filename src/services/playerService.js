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

async function updateReferralBonus(playerId) {
  const { mbCountAll, setMbCountAll } = useMbStore(); 

  // Получаем игрока с invited_friends и invited_by
  const player = await strapi.entityService.findOne('api::player.player', playerId, {
    populate: ['invited_friends', 'invited_by'],
  });

  // Текущий бонус из zustand или из player
  let currentMbCountAll = mbCountAll || player.clicks || 0;

  // --- 1. Проверяем бонус за приглашение самого игрока ---

  // Допустим, у тебя есть булево поле player.bonus_given_for_invited_by
  // Если нет, можно добавить его в Strapi
  let bonusGivenForInvitedBy = player.referal_bonus_given || false;

  // Если есть invited_by и бонус ещё не начислен
  if (player.invited_by && !bonusGivenForInvitedBy) {
    currentMbCountAll += 2500;
    bonusGivenForInvitedBy = true;
  }

  // --- 2. Проверяем бонус за приглашённых друзей ---

  const invitedFriendsIds = player.invited_friends.map(f => f.documentId);
  const invitedFriendsIdField = player.invited_friends_id || [];

  const newFriends = invitedFriendsIds.filter(id => !invitedFriendsIdField.includes(id));

  if (newFriends.length > 0) {
    currentMbCountAll += 2500 * newFriends.length;
  }

  // Обновляем zustand
  setMbCountAll(currentMbCountAll);

  // Обновляем поля в Strapi
  await strapi.entityService.update('api::player.player', playerId, {
    data: {
      mbCountAll: currentMbCountAll,
      invited_friends_id: [...invitedFriendsIdField, ...newFriends],
      bonus_given_for_invited_by: bonusGivenForInvitedBy,
    },
  });

  return {
    mbCountAll: currentMbCountAll,
    newBonusForFriends: newFriends.length,
    bonusGivenForInvitedBy,
  };
}

export default updateReferralBonus;
