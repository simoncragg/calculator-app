const Button = ({ className, disabled, onClick, children }) => {
  return (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
