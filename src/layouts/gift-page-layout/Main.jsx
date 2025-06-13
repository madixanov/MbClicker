import tasks from "./task-list"
import TabContent from './UI/TabContent'

const Main = () => {
    return (
        <main className="task-main">
            <h1 className="gift-title">ЕЖЕДНЕВНЫЙ БОНУС</h1>
            <TabContent tasks={tasks}/>
        </main>
    )
}

export default Main;