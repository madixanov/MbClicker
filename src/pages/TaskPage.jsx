import { lazy, useEffect } from 'react';
import usePlayerData from '../hooks/usePlayerData';

const Header = lazy(() => import('../components/Header'))
const Main = lazy(() => import('../layouts/task-page-layout/Main'))
const Footer = lazy(() => import('../components/Footer'))

const TaskPage = () => {
    const { loadPlayer} = usePlayerData();

    useEffect(() => {
            loadPlayer();
            document.body.classList.add("other-page")
            return () => {
                document.body.classList.remove('other-page')
            }
        }, [loadPlayer])

    return (
        <div className='task-page'>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default TaskPage;