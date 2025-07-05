import completed_logo from "../../../assets/icons/completed.svg";

const BonusButton = ({ bonus, onComplete, isCompleted, bonusLink }) => {
  const handleClick = () => {
    if (!bonusLink || isCompleted) return;

    // Открываем ссылку и вызываем onComplete
    window.open(bonusLink, '_blank');
    onComplete(bonus);
  };

  return (
    <div className="div-wrapper">
      {isCompleted ? <img src={completed_logo} className="completed-logo"/> : <button className="task-btn" onClick={handleClick}
      >ВЫПОЛНИТЬ</button>}
    </div>
  );
};

export default BonusButton;
