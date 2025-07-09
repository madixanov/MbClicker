import { lazy } from 'react';

const Header = lazy(() => import('../components/Header'))
const Main = lazy(() => import('../layouts/task-page-layout/Main'))
const Footer = lazy(() => import('../components/Footer'))

const TaskPage = () => {

    return (
        <div className='task-page'>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default TaskPage;