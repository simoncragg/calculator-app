const OperatorButton = ({ op, lastInput, onClick, children }) => {
  return (
    <button type="button" data-operator={op} className="sign" disabled={op === lastInput} onClick={onClick}>
      {children}
    </button>
  );
};

export default OperatorButton;
