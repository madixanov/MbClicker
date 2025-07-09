import tg from "../../../assets/icons/tg.svg";
import { useState, useEffect, useRef } from "react";
import { fetchPlayerWithFriends } from "../../../services/playerService";
import usePlayerStore from "../../../store/player-store";
import { motion, useInView } from "framer-motion";

const FriendsList = () => {
  const bgColors = ["#D9FF00", "#FFC839", "#FF0000"];
  const [friends, setFriends] = useState([]);
  const { player } = usePlayerStore();

  useEffect(() => {
    const loadFriends = async () => {
      if (!player) return;

      const updatePlayer = await fetchPlayerWithFriends(player.telegram_id);
      const friendsList = updatePlayer?.invited_friends || [];
      setFriends(friendsList);
    };

    loadFriends();
  }, [player]);

  return (
    <div className="friends-list">
      {friends.map((friend, index) => {
        const bgColor = bgColors[index % bgColors.length];
        const ref = useRef(null);
        const isInView = useInView(ref, {
          margin: "-20% 0px -20% 0px",
          once: false
        });

        return (
          <motion.div
            key={index}
            ref={ref}
            className="friend-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.9, y: 20 }
            }
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: "easeOut"
            }}
          >
            <div className="friend-avatar">
              <img
                src={friend.photo_url}
                alt={friend.username}
                className="friend-photo"
              />
              <img src={tg} alt="tg" className="friend-role-icon" />
              <div className="friend-number" style={{ backgroundColor: bgColor }}>
                {index + 1}
              </div>
            </div>
            <div className="friend-info">
              <p>{friend.username}</p>
              <div className="player-balance">
                <div className="div-b">
                  <div>{friend.clicks.toLocaleString("ru-RU")}</div>
                  <span>WXCXW</span>
                </div>
                <div className="div-e">
                  <div>0</div>
                  <span>ОБМЕНЫ</span>
                </div>
              </div>
            </div>
            <p>+ 2 500</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FriendsList;
