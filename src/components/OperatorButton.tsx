import React from "react";

interface OperatorButtonProps {
  op: string;
  lastInput?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const OperatorButton = ({ op, lastInput, onClick, children }: OperatorButtonProps) => {
  return (
    <button type="button" data-operator={op} className="sign" disabled={op === lastInput} onClick={onClick}>
      {children}
    </button>
  );
};

export default OperatorButton;
