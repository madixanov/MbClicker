import { useEffect } from 'react';
import axios from 'axios';

const useTelegramAuth = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();

    const user = tg?.initDataUnsafe?.user;

    if (!user) return;

    const telegram_id = Number(user.id); // ⬅️ Всегда как число

    const telegramUser = {
      telegram_id,
      username: user.username,
      photo_url: user.photo_url,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    axios
      .get(`https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${telegram_id}`)
      .then((res) => {
        const players = res.data.data;
        if (players.length === 0) {
          // ✅ Только если игрока нет — создаём
          return axios.post('https://mbclickerstrapi.onrender.com/api/players', {
            data: telegramUser,
          });
        } else {
          console.log('✅ Пользователь уже существует в базе (id:', players[0].id, ')');
        }
      })
      .then((res) => {
        if (res) console.log('🎉 Новый пользователь сохранён', res.data);
      })
      .catch((err) => {
        // Обработка ошибки при попытке дублировать
        if (err.response?.status === 400 && err.response.data?.error?.message?.includes("already exists")) {
          console.warn("⚠️ Пользователь уже существует (Strapi вернул duplicate error)");
        } else {
          console.error("❌ Ошибка при аутентификации:", err);
        }
      });
  }, []);
};

export default useTelegramAuth;
