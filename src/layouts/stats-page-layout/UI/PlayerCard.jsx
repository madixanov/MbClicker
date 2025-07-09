import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PlayerCard = ({ player, index, isCurrentUser }) => {
  const placement = index + 1;
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "-20% 0px -20% 0px", // появление только когда реально в видимой части
    once: false
  });

  const defaultAvatar = `data:image/svg+xml;utf8,
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect fill="white" width="100" height="100"/>
      <circle cx="50" cy="35" r="20" fill="%23ccc"/>
      <rect x="25" y="60" width="50" height="25" rx="10" fill="%23ccc"/>
    </svg>`;

  return (
    <motion.div
      ref={ref}
      className={`player-container ${isCurrentUser ? "highlight-player" : ""}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      <div className="placement-player">
        <p className="placement">#{placement}</p>
        <div className="player-info">
          <div className="leaders-photo-container">
            <img
              src={player.photo_url || defaultAvatar}
              alt={player.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
              style={{ backgroundColor: "white" }}
            />
          </div>
          <p>{player.username}</p>
        </div>
      </div>
      <p className="balance">{player.clicks?.toLocaleString('ru-RU') || 0}</p>
      <p className="exchanges">0</p>
    </motion.div>
  );
};

export default PlayerCard;
