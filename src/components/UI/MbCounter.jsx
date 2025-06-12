import logo from "../../assets/icons/logo.png"
import exchange from "../../assets/icons/exchange.png"
import useMbStore from "../../store/mb-store.js"

const MbCounter = () => {
    const mbCount = useMbStore((state) => state.mbCount);

    return (
        <div className="mb-counter-container">
            <div className="mb-counter">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                <h1>{mbCount}</h1>
                <div className="exchange">
                    <img src={exchange} alt="" />
                </div>
            </div>
            <p>MEGABYTE</p>
        </div>
    )
}

export default MbCounter;