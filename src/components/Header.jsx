import useModalStore from "../store/modal-store";
import dark from "../assets/icons/dark.png";
import light from "../assets/icons/light.png"

const Header = () => {
    const setModalDay = useModalStore((state) => state.setModalDay);
    const setModalTheme = useModalStore((state) => state.setModalTheme);

    return (
        <header>
            <div className="header-container">
                <div className="time-container" onClick={() => setModalDay(true)}>
                    <div className="div-day">1 DAY</div>
                    <p>TIME</p>
                </div>
                <div className="name-container">
                    <div>WEIXSE</div>
                    <p>YOUR NAME</p>
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
                    <p>THEME</p>
                </div>
            </div>
        </header>
    )
}

export default Header;