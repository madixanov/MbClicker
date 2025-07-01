const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;

  return tg?.initDataUnsafe?.user || null;
};

export default getTelegramUser;
