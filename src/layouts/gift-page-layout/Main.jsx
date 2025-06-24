import TabContent from './UI/TabContent'
import './gift-page.css'

const Main = () => {
    return (
        <main className="gift-main">
            <h1 className="gift-title" aria-label="Ежедневный бонус">ЕЖЕДНЕВНЫЙ БОНУС</h1>
            <TabContent />
        </main>
    )
}

export default Main;