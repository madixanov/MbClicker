import useModalStore from "../store/modal-store";
import dark from "../assets/icons/dark.svg";
import light from "../assets/icons/light.svg"
import './header.css'
import usePlayerStore from "../store/player-store";
import { memo } from "react";
import { shallow } from 'zustand/shallow';
import DayCounter from "./DayCounter";

const Header = memo(() => {
    const setModalDay = useModalStore((state) => state.setModalDay);
    const setModalTheme = useModalStore((state) => state.setModalTheme);

    const username = usePlayerStore((state) => state.player?.username, shallow);
    const createdAt = usePlayerStore((state) => state.player?.createdAt, shallow);

    return (
        <header>
            <div className="header-container">
                <div className="time-container" onClick={() => setModalDay(true)}>
                    <div className="div-day">{createdAt ? <DayCounter createdAt={createdAt} /> : "1 ДЕНЬ"}</div>
                    <p>ВРЕМЯ</p>
                </div>
                <div className="name-container">
                    <div>{username || "?"}</div>
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
})

export default Header;