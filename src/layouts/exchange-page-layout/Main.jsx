import { lazy } from "react"
import './exchange-page.css'

const Title = lazy(() => import('./UI/Title'))
const WithdrawContainer = lazy(() => import('./UI/WithdrawContainer'))
const InstructionList = lazy(() => import('./UI/InstructionList'))

const Main = () => {
    return (
        <main className="exchange-main">
            <Title />
            <WithdrawContainer />
            <InstructionList />
        </main>
    )
}

export default Main