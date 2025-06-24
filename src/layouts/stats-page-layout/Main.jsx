import { useState } from "react";
import DashBoard from "./UI/DashBoard";
import Leaders from "./UI/LeadersList";
import './stats-page.css';
import { Helmet } from "react-helmet";

const tabs = [
    { key: 'daily', label: 'ЗА ВСЕ ВРЕМЯ' },
    { key: 'giveaways', label: 'ЗА ЭТОТ МЕСЯЦ' },
];

const Main = () => {
    const [activeTab, setActiveTab] = useState('daily');

    return (
        <main className="stats-main">
            <Helmet>
                <meta name="description" content="Смотри свою статистику, соревнуйся, выходи в топ!" />
            </Helmet>

            <h1>ТОП ИГРОКОВ</h1>

            <div className="tab-row">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={activeTab === tab.key ? 'active-tab' : 'non-active-tab'}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <DashBoard />

            <h2 className="leaders-title">ЛИДЕРЫ</h2>

            <div className="leaders-container">
                <div className="leaders-header">
                    <div className="p-row-leaders">
                        <p>ТРЕЙДЕР</p>
                        <p>БАЛАНС</p>
                        <p>ОБМЕНЫ</p>
                    </div>
                    <div className="your-placement-badge">
                        ТЫ НА #3 В ТОПЕ
                    </div>
                </div>

                <div className="leaders-list-scroll">
                    <Leaders />
                </div>
            </div>
        </main>
    );
};

export default Main;
