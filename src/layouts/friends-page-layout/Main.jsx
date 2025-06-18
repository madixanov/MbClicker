import { useState, useRef } from "react";
import tg from '../../assets/icons/tg.png';
import premium from '../../assets/icons/premium.png';
import FriendsList from "./UI/FriendsList";
import './friends-page.css';
import BonusCard from "./UI/BonusCard";

const Main = () => {
    const [ copied, setCopied ] = useState(false);
    const inputRef = useRef(null);

    const linkValue = 'YOUR LINK HERE'

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
                        value={linkValue} 
                        readOnly 
                        className="link-input" 
                    />
                    <div className="fade-overlay"></div>
                    <div className="btn-container">
                        <button 
                            className={`submit-btn ${copied ? 'copied' : ''}`} 
                            onClick={handleCopyClick}
                            aria-label="Копировать ссылку"
                            >
                            {copied ? 'СКОПИРОВАНО' : 'СКОПИРОВАТЬ'}
                        </button>
                    </div>
                </div>

                <div className="bonus">
                    <BonusCard img={tg} value="10 000" type="обычный" />
                    <BonusCard img={premium} value="30 000" type="premium" />
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