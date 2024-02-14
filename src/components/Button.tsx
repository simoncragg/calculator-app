import React from "react";

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

const Button = ({ className, disabled, onClick, children }: ButtonProps) => {
  return (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
