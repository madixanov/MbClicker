import { lazy, useEffect } from 'react'
import '../layouts/friends-page-layout/friends-page.css'

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Main = lazy(() => import('../layouts/friends-page-layout/Main'))

const FriendsPage = () => {
    useEffect(() => {
        document.body.classList.add("other-page")

        return () => {
            document.body.classList.remove('other-page')
        }
    }, [])

    return (
        <div className='friends-page'>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default FriendsPage;