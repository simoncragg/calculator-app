import { useState, useEffect } from "react";

import OperatorIndicator from "./OperatorIndicator";
import { useCalculator } from "../CalculatorStore";

const calculateFontSize = (value: string): string => {
  const len = value.replace(/,/g, "").length;
  if (len < 6) return "86px";
  if (len < 7) return "84px";
  if (len < 8) return "70px";
  if (len < 9) return "62px";
  if (len < 10) return "56px";
  return "53px";
};

const Display = () => {
  const { calc } = useCalculator();
  const { output, lastInput, voltageLevel } = calc;
  
  const [fontSize, setFontSize] = useState<string>("86px");
  const [showEqualsIndicator, setShowEqualsIndicator] = useState(false);

  useEffect(() => {
    if (output) {
      setFontSize(calculateFontSize(output));
    }
  }, [output]);

  useEffect(() => {
    setShowEqualsIndicator(lastInput === "=");
  }, [lastInput]);

  return (
    <div className="relative flex w-full h-24 items-center justify-end mb-6 bg-[#687] font-sans rounded shadow-inner shadow-black">
      
      <OperatorIndicator />

      {showEqualsIndicator && (
        <span 
          data-testid="equals-indicator"
          aria-label="Equals sign"
          className="absolute -top-[7px] right-2 text-3xl text-stone-800"
          style={{ opacity: voltageLevel }}
        >
            =
          </span>
      )}

      <span 
        data-testid="output" 
        className="pt-4 px-3.5 text-stone-800" 
        style={{ fontSize, opacity: voltageLevel }}>
        {output}
      </span>
      
    </div>
  );
};

export default Display;
