import gift from "../../assets/icons/gift.png";
import task from "../../assets/icons/task.png";
import selected_home from "../../assets/icons/selected-icons/selected-home.png";
import empty_stats from "../../assets/icons/empty_stats.png";
import stats from "../../assets/icons/stats.png";
import friends from "../../assets/icons/friends.png";
import useMbStore from "../../store/mb-store";

const RouterIcon = () => {
  const mbCount = useMbStore((state) => state.mbCount);

  const statsImage = mbCount === 0 ? empty_stats : stats;

  return (
    <div className="router-icons-container">
      <div className="icon-item">
        <img src={gift} alt="Gift Icon" />
      </div>
      <div className="icon-item">
        <img src={task} alt="Task Icon" />
      </div>
      <div className="icon-item">
        <img src={selected_home} alt="Home Icon" />
      </div>
      <div className="icon-item">
        <img src={statsImage} alt="Stats Icon" />
      </div>
      <div className="icon-item">
        <img src={friends} alt="Friends Icon" />
      </div>
    </div>
  );
};

export default RouterIcon;
