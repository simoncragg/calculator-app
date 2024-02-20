import { useState, useEffect } from "react";

const OPERATOR_WIDTH = 17;
const START_POSITION = 46.5;

const symbolTranslations: { [key: string]: string } = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const operators = Object.keys(symbolTranslations);

interface OperatorIndicatorProps {
    lastInput?: string;
}

const OperatorIndicator = ({ lastInput }: OperatorIndicatorProps) => {

  const [symbol, setSymbol] = useState<string>();
  const [position, setPosition] = useState<number>(0); 

  useEffect(() => {
    if (!lastInput) return;
    if (operators.includes(lastInput)) {
      setSymbol(symbolTranslations[lastInput]);
      const pos = START_POSITION + OPERATOR_WIDTH * operators.indexOf(lastInput);
      setPosition(pos);
    } else {
      setSymbol(undefined);
    }
  }, [lastInput]);

  return (
    <>
      {symbol && (
        <div className="absolute top-1" style={{ right: `${position}px` }}>
          <div className="relative">
            <span  className="absolute w-[17px] leading-[1.1] text-stone-800 bg-stone-800 rounded-sm" aria-hidden="true">
              &nbsp;
            </span>
            <span data-testid="operator-indicator" className="absolute -top-[9px] -right-[15px] font-bold text-[#687] text-2xl">
              {symbol}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default OperatorIndicator;
