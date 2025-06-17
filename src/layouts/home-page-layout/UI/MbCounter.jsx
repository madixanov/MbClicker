import logo from "../../../assets/icons/logo.svg"
import exchange from "../../../assets/icons/exchange.svg"
import exchange1 from "../../../assets/icons/exchange1.svg"
import useMbStore from "../../../store/mb-store.js"

import { useNavigate } from "react-router"
import { useCallback, useEffect, useState } from "react"
import { animate } from "framer-motion"

const MbCounter = () => {
    const mbCountAll = useMbStore((state) => state.mbCountAll);
    const [animatedCount, setAnimatedCount] = useState(mbCountAll);

    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate('/exchange');
    }, [navigate]);

    useEffect(() => {
        const controls = animate(animatedCount, mbCountAll, {
            duration: 1,
            onUpdate: (latest) => {
                setAnimatedCount(Math.round(latest));
            },
        });

        return () => controls.stop();
    }, [mbCountAll]);

    return (
        <div className="mb-counter-container">
            <div className="mb-counter">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <h1>{animatedCount.toLocaleString('ru-RU')}</h1>
                <div className="exchange" onClick={handleClick}>
                    <img src={exchange} alt="" />
                    <img src={exchange1} alt="" />
                </div>
            </div>
            <p>MEGABYTE</p>
        </div>
    );
};

export default MbCounter;
