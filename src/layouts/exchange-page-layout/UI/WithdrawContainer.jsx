import useMbStore from "../../../store/mb-store"
import logo from "../../../assets/icons/logo.svg"
import exchange from "../../../assets/icons/exchange.svg"
import exchange1 from "../../../assets/icons/exchange1.svg"
import { useState } from "react"

const WithdrawContainer = () => {
    const [ inputValue, setInputValue ] = useState('');

    function handleChange(event) {
        setInputValue(event.target.value)
    }
    
    const handleButtonClick = (value) => {
        const cleanValue = value.replace(/\s*КБ\s*/gi, "");
        setInputValue(cleanValue);
    }

    const mbCountAll = useMbStore((state) => state.mbCountAll)

    return (
        <div className="withdraw-container">
            <div className="budget">
                <div>
                    <div className="exchange">
                        <img src={exchange} alt="" />
                        <img src={exchange1} alt="" />
                    </div>
                    <h1 className="budget-h1">{mbCountAll.toLocaleString('ru-RU')} КБ</h1>
                    <div className="logo">
                        <img src={logo} alt="" />
                    </div>
                </div>
                <p>ВСЕГО КИЛОБАЙТ</p>
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
                            <button type="button" onClick={() => handleButtonClick("1 024 КБ")}>1 024 KБ</button>
                            <button type="button" onClick={() => handleButtonClick("2 048 КБ")}>2 048 KБ</button>
                            <button type="button" onClick={() => handleButtonClick("5 120 КБ")}>5 120 KБ</button>
                        </div>
                    </div>
                </div>
                <button className="submit-btn">ПОЛУЧИТЬ</button>
            </form>
        </div>
    )
}

export default WithdrawContainer