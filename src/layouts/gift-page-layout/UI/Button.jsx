import completed_logo from "../../../assets/icons/completed.svg";
import { useEffect, useState } from "react";

const BonusButton = ({ bonus, onComplete, isCompleted, bonusLink }) => {
  const [state, setState] = useState('initial');

  const handleClick = () => {
    if (!bonusLink || isCompleted) return;

    window.open(bonusLink, '_blank');
    onComplete(bonus); // обновляет isCompleted в родителе
  };

  useEffect(() => {
    if (isCompleted) {
      setState('claimed');
    }
  }, [isCompleted]);

  if (state === 'claimed' || isCompleted) {
    return (
      <span className="task-done">
        <img src={completed_logo} alt="✓" className="completed-logo"/>
      </span>
    );
  }

  return (
    <button className="task-btn" onClick={handleClick}>
      ВЫПОЛНИТЬ
    </button>
  );
};

export default BonusButton;
