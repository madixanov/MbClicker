import { useState } from "react"
import TabContent from "./UI/TabContent"
import "./tasks-page.css"
import { Helmet } from "react-helmet"
import usePlayerData from "../../hooks/usePlayerData"
import PageLoading from "../../pages/PageLoading"

const Main = () => {
    const [ activeTab, setActiveTabs ] = useState('daily');
    const [ loading, setLoading ] = useState(true);

    return (
        <main className="task-main">
            <Helmet>
                <meta name="description" content="Выполняй разные задачи и зарабатывай больше MB!" />
            </Helmet>
            <div className="task-title"><h1>ЗАДАНИЯ</h1></div>
            <div className="tab-row">
                <button className={activeTab === 'daily' ? 'active-tab' : 'non-active-tab'} onClick={() => setActiveTabs('daily')}>ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</button>
                <button className={activeTab === 'giveaways' ? 'active-tab' : 'non-active-tab'} onClick={() => setActiveTabs('giveaways')}>РОЗЫГРЫШИ</button>
            </div>
            <TabContent loading={loading} setLoading={setLoading}/>
        </main>
    )
}

export default Main