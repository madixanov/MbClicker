import friends from "../friends";
import tg from '../../../assets/icons/tg.png'
import premium from '../../../assets/icons/premium.png'

const FriendsList = () => {
    const bgColors = ['#D9FF00', '#FFC839', '#FF0000' ]

    return (
        <div className="friends-list">
            {friends.map(
                (friend, index) => {

                    const bgColor = bgColors[index % bgColors.length]

                    return (
                    <div className="friend-container">
                        <div className="friend-avatar">
                            <img src={friend.img} alt={friend.name} className="friend-photo"/>
                            <img src={friend.role === 'premium' ? premium : tg} alt={friend.role} className="friend-role-icon" />
                            <div className="friend-number" style={{ backgroundColor: bgColor}}>{index}</div>
                        </div>
                        <div className="friend-info">
                            <p>{friend.name}</p>
                            <div className="player-balance">
                                <div className="div-b"><div>{friend.balance.toLocaleString('ru-RU')}</div> <span>WXCXW</span></div>
                            <div className="div-e"><div>{friend.exchanges}</div><span>EXCHANGES</span></div>
                            </div>
                        </div>
                        <p>{friend.role === 'premium' ? '+ 30 000' : '+ 10 000'}</p>
                    </div>
            )}
            )}
        </div>
    )
}

export default FriendsList