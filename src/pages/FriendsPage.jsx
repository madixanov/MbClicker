import { lazy } from 'react'
import '../layouts/friends-page-layout/friends-page.css'

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/friends-page-layout/Main'))

const FriendsPage = () => {


    return (
        <div className='friends-page'>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default FriendsPage;