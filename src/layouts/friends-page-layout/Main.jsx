import { useState, useRef } from "react";
import tg from '../../assets/icons/tg.png';
import premium from '../../assets/icons/premium.png';
import bonus from '../../assets/icons/bonus.png';
import FriendsList from "./UI/FriendsList";

import './friends-page.css'

const Main = () => {
    const [btnName, setBtnName] = useState('COPY');
    const invitedRef = useRef(null);

    return (
        <main className="friends-main">
            <div className="link-container">
                <h1>МОИ ДРУЗЬЯ</h1>
                <h2>ТВОЯ ССЫЛКА</h2>
                <div className="input-container">
                    <input type="text" value={'LINK'} readOnly className="link-input" />
                    <div className="fade-overlay"></div>
                    <div className="btn-container">
                        <button className="submit-btn" onClick={() => setBtnName("COPIED")}>{btnName}</button>
                    </div>
                </div>

                <div className="bonus">
                    <div className="tg-bonus">
                        <img src={tg} alt="" />
                        <div className="i-bonus">
                            <p>+ 10 000</p>
                            <img src={bonus} alt="" />
                        </div>
                        <p>FOR YOU AND YOUR FRIEND</p>
                        <p className="p-regular">REGULAR</p>
                    </div>
                    <div className="premium-bonus">
                        <img src={premium} alt="" />
                        <div className="i-bonus">
                            <p>+ 30 000</p>
                            <img src={bonus} alt="" />
                        </div>
                        <p>FOR YOU AND YOUR FRIEND</p>
                        <p className="p-prem">PREMIUM</p>
                    </div>
                </div>
            </div>

            <div className="friends-container">
                <p ref={invitedRef}>INVITED FRIENDS</p>
                <div className="friends-list-scroll">
                    <FriendsList />
                </div>
            </div>
        </main>
    );
};

export default Main;
