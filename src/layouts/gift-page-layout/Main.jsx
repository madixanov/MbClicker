import TabContent from './UI/TabContent'
import './gift-page.css'
import PageLoading from '../../pages/PageLoading'
import { useState } from 'react'

const Main = () => {
    const [ loading, setLoading ] = useState(true);

    if (loading) return <PageLoading loading={loading}/>

    return (
        <main className="gift-main">
            <h1 className="gift-title" aria-label="Ежедневный бонус">ЕЖЕДНЕВНЫЙ БОНУС</h1>
            <TabContent loading={loading} setLoading={setLoading}/>
        </main>
    )
}

export default Main;