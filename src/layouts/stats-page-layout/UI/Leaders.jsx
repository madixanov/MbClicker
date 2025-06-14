import LeadersList from "./LeadersList"

const Leaders = () => {
    return (
        <div className="leaders">
            <div className="p-row-leaders">
                <p>TRADER</p>
                <p>BALANCE</p>
                <p>EXCHANGES</p>
            </div>
            <div className="your-placement">
                <div>YOU ARE #3 IN TOP</div>
            </div>

            <div className="leaders-list-scroll">
                <LeadersList />
            </div>
        </div>

    )
}

export default Leaders