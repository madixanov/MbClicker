import { useState, useRef } from "react";
import tg from '../../assets/icons/tg.png';
import premium from '../../assets/icons/premium.png';
import FriendsList from "./UI/FriendsList";
import './friends-page.css';

const Main = () => {
    const [ copied, setCopied ] = useState(false);
    const inputRef = useRef(null);

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(inputRef.current.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Ошибка при копировании.', err)
        }
    };

    return (
        <main className="friends-main">
            <div className="link-container">
                <h1>МОИ ДРУЗЬЯ</h1>
                <h2>ТВОЯ ССЫЛКА</h2>
                <div className="input-container">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={'LINK'} 
                        readOnly 
                        className="link-input" 
                    />
                    <div className="fade-overlay"></div>
                    <div className="btn-container">
                        <button 
                            className="submit-btn" 
                            onClick={handleCopyClick}
                        >
                            {copied ? 'СКОПИРОВАНО' : 'СКОПИРОВАТЬ'}
                        </button>
                    </div>
                </div>

                <div className="bonus">
                    <div className="tg-bonus">
                        <img src={tg} alt="Telegram" />
                        <div className="i-bonus">
                            <p>+ 10 000</p>
                        </div>
                        <p>ВАМ И ВАШЕМУ ДРУГУ</p>
                        <p className="p-regular">ОБЫЧНЫЙ</p>
                    </div>
                    <div className="premium-bonus">
                        <img src={premium} alt="Premium" />
                        <div className="i-bonus">
                            <p>+ 30 000</p>
                        </div>
                        <p>ВАМ И ВАШЕМУ ДРУГУ</p>
                        <p className="p-prem">ПРЕМИУМ</p>
                    </div>
                </div>
            </div>

            <div className="friends-container">
                <p className="friend-title">ПРИГЛАШЕННЫЕ ДРУЗЬЯ</p>
                <div 
                    className="friends-list-scroll"
                >
                    <FriendsList />
                </div>
            </div>
        </main>
    );
};

export default Main;