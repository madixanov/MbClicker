import tasks from "./task-list"
import TabContent from './UI/TabContent'

const Main = () => {
    return (
        <main className="task-main">
            <TabContent tasks={tasks}/>
        </main>
    )
}

export default Main;