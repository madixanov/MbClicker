import { useState, useEffect } from "react";
import { fetchPlayerWithFriends } from "../../../services/playerService";
import usePlayerStore from "../../../store/player-store";
import FriendCard from "./FriendCard"; // обязательно создай этот компонент

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
        return (
          <FriendCard
            key={friend.documentId || index}
            friend={friend}
            index={index}
            bgColor={bgColor}
          />
        );
      })}
    </div>
  );
};

export default FriendsList;
