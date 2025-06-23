const getTelegramUser = () => {
  const tg = window.Telegram?.WebApp;
  tg?.ready();

  return tg?.initDataUnsafe?.user || null;
};

export default getTelegramUser;
