import { useState } from "react";
import avatar from "../../assets/images/avatar.png"
import useMbStore from "../../store/mb-store";

const Avatar = () => {
    const increment = useMbStore((state) => state.increment);
    const [ showText, setShowText ] = useState(false);

    const handleClick = () => {
        increment();
        setShowText(true);

        setTimeout(() => {
            setShowText(false);
        }, 1000);
    }

    return (
        <div className="avatar-container" onClick={handleClick}>
            <img src={avatar} alt="" />
            {showText && <p className="popup-text">+ 10</p>}
        </div>
    )
}

export default Avatar;