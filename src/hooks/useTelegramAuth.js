import { useEffect } from 'react';
import axios from 'axios';

const useTelegramAuth = () => {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        const user = tg?.initDataUnsafe?.user;
        if (!user) return;

    const telegramUser = {
        telegram_id: user.id,
        username: user.username,
        photo_url: user.photo_url,
        first_name: user.first_name,
        last_name: user.last_name,
    };

    axios
        .get(`https://mbclickerstrapi.onrender.com/api/players?filters[telegram_id][$eq]=${user.id}`)
        .then((res) => {
            if (res.data.data.length === 0) {
                return axios.post('https://mbclickerstrapi.onrender.com/api/players', {
                    data: telegramUser,
                });
            } else {
            console.log('✅ Пользователь уже существует в базе');
        }
        })
        .then((res) => {
            if (res) console.log('🎉 Новый пользователь сохранён', res.data);
        })
        .catch((err) => console.error('❌ Ошибка при аутентификации:', err));
    }, []);
};

export default useTelegramAuth;
