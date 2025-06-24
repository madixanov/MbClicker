import { lazy } from "react"
import './exchange-page.css'
import { Helmet } from "react-helmet"

const Title = lazy(() => import('./UI/Title'))
const WithdrawContainer = lazy(() => import('./UI/WithdrawContainer'))
const InstructionList = lazy(() => import('./UI/InstructionList'))

const Main = () => {
    return (
        <main className="exchange-main">
            <Helmet>
                <meta name="description" content="Обменивай заработанные MB токены на настоящие мегабайты!" />
            </Helmet>
            <Title />
            <WithdrawContainer />
            <InstructionList />
        </main>
    )
}

export default Main