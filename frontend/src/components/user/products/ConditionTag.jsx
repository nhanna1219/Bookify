const colorMap = {
    NEW: 'bg-[#DB1515]',
    'LIKE NEW': 'bg-[#DB5415]',
    GOOD: 'bg-[#CE1B66]',
    ACCEPTABLE: 'bg-[#FFC107]',
};

const ConditionTag = ({ type }) => (
    <span className={`${colorMap[type]} text-white font-semibold text-[10px] px-3 py-1 rounded shadow-xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]`}>
        {type}
    </span>
);

export default ConditionTag;
