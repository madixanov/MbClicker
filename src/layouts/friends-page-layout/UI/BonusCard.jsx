const BonusCard = ({ img, value, type }) => (
    <div className={`bonus-card ${type === 'premium' ? 'premium-bonus' : 'tg-bonus'}`}>
        <img src={img} alt={type} />
        <div className="i-bonus"><p>+ {value}</p></div>
        <p>ВАМ И ВАШЕМУ ДРУГУ</p>
        <p className={type === 'premium' ? 'p-prem' : 'p-regular'}>{type.toUpperCase()}</p>
    </div>
);

export default BonusCard;