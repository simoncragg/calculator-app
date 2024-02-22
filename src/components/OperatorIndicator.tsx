import React, { useState, useEffect } from "react";
import { LuPlus, LuMinus, LuX, LuDivide } from "react-icons/lu";
import { useCalculator } from "../CalculatorStore";

const OPERATOR_WIDTH = 15;
const START_POSITION = 46.5;

const operatorLookup: { [key: string]: { ariaLabel: string, icon: React.ReactElement }} = {
  "+": { ariaLabel: "Plus sign", icon: <LuPlus /> },
  "-": { ariaLabel: "Minus sign", icon: <LuMinus /> },
  "*": { ariaLabel: "Multiply sign", icon: <LuX /> },
  "/": { ariaLabel: "Divide by sign", icon: <LuDivide /> },
};

const operators = Object.keys(operatorLookup);

const OperatorIndicator = () => {

  const { calc } = useCalculator();
  const { lastInput, voltageLevel } = calc;

  const [operator, setOperator] = useState<{ ariaLabel: string, icon: React.ReactElement } | undefined>();
  const [position, setPosition] = useState<number>(0); 

  useEffect(() => {
    if (!lastInput) return;
    if (operators.includes(lastInput)) {
      setOperator(operatorLookup[lastInput]);
      const pos = START_POSITION + OPERATOR_WIDTH * operators.indexOf(lastInput);
      setPosition(pos);
    } else {
      setOperator(undefined);
    }
  }, [lastInput]);

  return (
    <>
      {operator && (
        <div 
          className="absolute top-1" 
          style={{ right: `${position}px`, opacity: voltageLevel }}
        >
          <div className="relative">
            <span 
              data-testid="operator-indicator"
              aria-label={operator.ariaLabel}
              className="absolute -top-0.5 -right-5 text-[#687] text-2xl bg-stone-800 rounded-sm scale-[65%]"
            >
              {operator.icon}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default OperatorIndicator;
