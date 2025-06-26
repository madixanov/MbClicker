import LeadersList from "./LeadersList"
import usePlacementStore from "../../../store/placement-store"

const Leaders = () => {
    const myPlacement = usePlacementStore((state) => state.placement)
    return (
        <div className="leaders">
            <div className="p-row-leaders">
                <p>TRADER</p>
                <p>BALANCE</p>
                <p>EXCHANGES</p>
            </div>
            <div className="your-placement">
                <div>YOU ARE #{myPlacement} IN TOP</div>
            </div>

            <div className="leaders-list-scroll">
                <LeadersList />
            </div>
        </div>

    )
}

export default Leaders