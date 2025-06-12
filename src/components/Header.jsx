import dark from "../assets/icons/dark.png";
import light from "../assets/icons/light.png"

const Header = () => {
    return (
        <header>
            <div className="time-container">
                <div>1 DAY</div>
                <p>TIME</p>
            </div>
            <div className="name-container">
                <div>WEIXSE</div>
                <p>YOUR NAME</p>
            </div>
            <div className="theme-container">
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
        </header>
    )
}

export default Header;