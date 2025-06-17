import { useState } from "react";
import DashBoard from "./UI/DashBoard";
import Leaders from "./UI/LeadersList";
import './stats-page.css';

const Main = () => {
    const [activeTab, setActiveTabs] = useState('daily');

    return (
        <main className="stats-main">
            <h1>ТОП ИГРОКОВ</h1>
            <div className="tab-row">
                <button 
                    className={activeTab === 'daily' ? 'active-tab' : 'non-active-tab'} 
                    onClick={() => setActiveTabs('daily')}
                >
                    ЗА ВСЕ ВРЕМЯ
                </button>
                <button 
                    className={activeTab === 'giveaways' ? 'active-tab' : 'non-active-tab'} 
                    onClick={() => setActiveTabs('giveaways')}
                >
                    ЗА ЭТОТ МЕСЯЦ
                </button>
            </div>
            
            <DashBoard />
            <h2 className="leaders-title">ЛИДЕРЫ</h2>

            <div className="leaders-container">
                <div className="leaders-header">
                    <div className="p-row-leaders">
                        <p>TRADER</p>
                        <p>BALANCE</p>
                        <p>EXCHANGES</p>
                    </div>
                    <div className="your-placement-badge">
                        YOU ARE #3 IN TOP
                    </div>
                </div>

                <div className="leaders-list-scroll">
                    <Leaders />
                </div>
            </div>
        </main>
    )
}

export default Main;