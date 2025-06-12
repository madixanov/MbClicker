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

  const menuItems = [
    { icon: gift, label: "GIFT" },
    { icon: task, label: "TASK" },
    { icon: selected_home, label: "HOME", isSelected: true },
    { icon: statsImage, label: "STATS" },
    { icon: friends, label: "FRIENDS" }
  ];

  return (
    <>
      <div className="router-icons-container">
        {menuItems.map((item, index) => (
          <div key={index} className={`icon-wrapper ${item.isSelected ? 'selected' : ''}`}>
            <div className="icon-item">
              <img src={item.icon} alt={`${item.label} Icon`} />
            </div>
          </div>
        ))}
      </div>
      <div className="labels-container">
        {menuItems.map((item, index) => (
          <p key={index} className={item.isSelected ? 'selected-label' : ''}>
            {item.label}
          </p>
        ))}
      </div>
    </>
  );
};
export default RouterIcon;
