import { useState } from "react"
import tasks from "./task-list"
import TabContent from "./UI/TabContent"

const Main = () => {
    const [ activeTab, setActiveTabs ] = useState('daily')

    return (
        <main className="task-main">
            <div className="task-title"><h1>ЗАДАНИЯ</h1></div>
            <div className="tab-row">
                <button className={activeTab === 'daily' ? 'active-tab' : 'non-active-tab'} onClick={() => setActiveTabs('daily')}>ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</button>
                <button className={activeTab === 'giveaways' ? 'active-tab' : 'non-active-tab'} onClick={() => setActiveTabs('giveaways')}>РОЗЫГРЫШИ</button>
            </div>
            <TabContent tasks={tasks} />
        </main>
    )
}

export default Main