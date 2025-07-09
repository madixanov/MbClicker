import { useEffect, useState } from "react";
import { fetchDashboardPlayers } from "../../../services/playerService";
import { motion } from "framer-motion";

const DashBoard = () => {
  const [players, setPlayers] = useState([]);

  const defaultAvatar = `data:image/svg+xml;utf8,
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect fill="white" width="100" height="100"/>
      <circle cx="50" cy="35" r="20" fill="%23ccc"/>
      <rect x="25" y="60" width="50" height="25" rx="10" fill="%23ccc"/>
    </svg>`;

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchDashboardPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Ошибка при загрузке игроков:", error);
      }
    };
    loadPlayers();
  }, []);

  return (
    <div className="dash-board">
      {players.map((player, index) => {
        let cardClass = "profile-card";
        let imgClass = "pfp-container";

        if (index === 0) {
          cardClass += " top-card";
          imgClass += " top-player-img";
        } else if (index === 1) {
          cardClass += " second-card";
          imgClass += " second-player-img";
        }

        return (
          <motion.div
            key={player.name || player.username || index}
            className={cardClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: index === 0 ? -10 : 0 // Первый игрок чуть выше
            }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <div className={imgClass}>
              <img
                src={player.photo_url || defaultAvatar}
                alt={player.username}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                style={{ backgroundColor: "white" }}
              />
            </div>
            <h2>{player.username}</h2>
            <p>
              БАЛАНС: <span>{player.clicks?.toLocaleString("ru-RU") || 0}</span>
            </p>
            <p>
              ОБМЕНЫ: <span>0</span>
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashBoard;
