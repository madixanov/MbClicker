import tg from '../../../assets/icons/tg.png'
import { useState, useEffect } from "react";
import { fetchPlayerWithFriends, updatePlayerWithFallback } from "../../../services/playerService";
import usePlayerStore from "../../../store/player-store";
import useMbStore from "../../../store/mb-store";

const FriendsList = () => {
    const bgColors = ['#D9FF00', '#FFC839', '#FF0000' ]
    const [ friends, setFriends ] = useState([]);
    const { player } = usePlayerStore();
    const setMbCountAll = useMbStore((state) => state.setMbCountAll);
    const mbCountAll = useMbStore((state) => state.mbCountAll);

    useEffect(() => {
        const loadFriends = async () => {
            if (!player) return;

            const updatePlayer = await fetchPlayerWithFriends(player.telegram_id);
            const friendsList = updatePlayer?.invited_friends || [];
            setFriends(friendsList);

            if (!updatePlayer?.bonus_given) {
                const bonus = friendsList.length * 2500;
                setMbCountAll(mbCountAll + bonus);

                await updatePlayerWithFallback(updatePlayer.documentId, {
                    bonus_given: true
                })

                console.log(`🎁 Бонус начислен: ${bonus}`)
            } else {
            console.log("⏩ Бонус уже был начислен ранее")
            }
        }

        loadFriends();
    }, [player])

    return (
        <div className="friends-list">
            {friends.map(
                (friend, index) => {
                    const bgColor = bgColors[index % bgColors.length]

                    return (
                    <div className="friend-container" key={index}>
                        <div className="friend-avatar">
                            <img src={friend.photo_url} alt={friend.username} className="friend-photo"/>
                            <img src={tg} alt={friend.role} className="friend-role-icon" />
                            <div className="friend-number" style={{ backgroundColor: bgColor}}>{index+1}</div>
                        </div>
                        <div className="friend-info">
                            <p>{friend.username}</p>
                            <div className="player-balance">
                                <div className="div-b"><div>{friend.clicks.toLocaleString('ru-RU')}</div> <span>WXCXW</span></div>
                            <div className="div-e"><div>0</div><span>ОБМЕНЫ</span></div>
                            </div>
                        </div>
                        <p>+ 2 500</p>
                    </div>
            )}
            )}
        </div>
    )
}

export default FriendsList