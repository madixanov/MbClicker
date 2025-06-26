import { useEffect, useState } from "react";
import { fetchDashboardPlayers } from "../../../services/playerService";

const DashBoard = () => {
    const [ players, setPlayers ] = useState([]);

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
    }, [])

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
                    <div key={player.name} className={cardClass}>
                        <div className={imgClass}>
                            <img src={player.photo_url} alt={player.name} />
                        </div>
                        <h2>{player.name}</h2>
                        <p>БАЛАНС: <span>{player.clicks.toLocaleString('ru-RU')}</span></p>
                        <p>ОБМЕНЫ: <span>0</span></p>
                    </div>
                );
            })}
        </div>
    );
};

export default DashBoard;
