import useMbStore from "../../../store/mb-store"
import logo from "../../../assets/icons/logo.png"
import exchange from "../../../assets/icons/exchange.png"
import { useState } from "react"

const WithdrawContainer = () => {
    const [ inputValue, setInputValue ] = useState('');

    function handleChange(event) {
        setInputValue(event.target.value)
    }
    
    const handleButtonClick = (value) => {
        const cleanValue = value.replace(/\s*MB\s*/gi, "");
        setInputValue(cleanValue);
    }

    const mbCountAll = useMbStore((state) => state.mbCountAll)

    return (
        <div className="withdraw-container">
            <div className="budget">
                <div>
                    <div className="exchange">
                        <img src={exchange} alt="" />
                    </div>
                    <h1 className="budget-h1">{mbCountAll.toLocaleString('ru-RU')} MB</h1>
                    <div className="logo">
                        <img src={logo} alt="" />
                    </div>
                </div>
                <p>ВСЕГО МЕГАБАЙТ</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <p>СКОЛЬКО ВЫ ХОТИТЕ ОБМЕНЯТЬ?</p>
                <div>
                    <div className="logo">
                        <img src={logo} alt="" />
                    </div>

                    <div className="input-wrapper">
                        <input type="text" className="styled-input" onChange={handleChange} value={inputValue}/>
                        <div className="input-line"></div>
                        <div className="button-row">
                            <button type="button" onClick={() => handleButtonClick("1 024 MB")}>1 024 MB</button>
                            <button type="button" onClick={() => handleButtonClick("2 048 MB")}>2 048 MB</button>
                            <button type="button" onClick={() => handleButtonClick("5 120 MB")}>5 120 MB</button>
                        </div>
                    </div>
                </div>
                <button className="submit-btn">ПОЛУЧИТЬ</button>
            </form>
        </div>
    )
}

export default WithdrawContainer