import useModalStore from "../store/modal-store";
import dark from "../assets/icons/dark.svg";
import light from "../assets/icons/light.svg"
import './header.css'
import usePlayerData from "../hooks/usePlayerData";

const Header = () => {
    const setModalDay = useModalStore((state) => state.setModalDay);
    const setModalTheme = useModalStore((state) => state.setModalTheme);

    const { player } = usePlayerData();
    console.log(player);

    return (
        <header>
            <div className="header-container">
                <div className="time-container" onClick={() => setModalDay(true)}>
                    <div className="div-day">1 DAY</div>
                    <p>ВРЕМЯ</p>
                </div>
                <div className="name-container">
                    <div>{player?.username || "?"}</div>
                    <p>ВАШЕ ИМЯ</p>
                </div>
                <div className="theme-container" onClick={() => setModalTheme(true)}>
                    <div>
                        <div className="selected">
                            <img src={dark} alt="Dark Mode"  className=""/>
                        </div>
                        <div>
                            <img src={light} alt="Light Mode" className="" />
                        </div>
                    </div>
                    <p>ТЕМА</p> 
                </div>
            </div>
        </header>
    )
}

export default Header;