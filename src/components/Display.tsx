import { useState, useEffect } from "react";
import OperatorIndicator from "./OperatorIndicator";

const calculateFontSize = (value: string): string => {
  const len = value.replace(/,/g, "").length;
  if (len < 6) return "86px";
  if (len < 7) return "84px";
  if (len < 8) return "70px";
  if (len < 9) return "62px";
  return "56px";
};

interface DisplayProps {
  value: string;
  lastInput?: string;
}

const Display = ({ value, lastInput }: DisplayProps) => {
  const [fontSize, setFontSize] = useState<string>("86px");

  useEffect(() => {
    if (value) {
      setFontSize(calculateFontSize(value));
    }
  }, [value]);

  return (
    <div className="relative flex w-full h-24 items-center justify-end mb-6 bg-[#687] font-sans rounded shadow-inner shadow-black">

      <OperatorIndicator lastInput={lastInput} />

      <span data-testid="output" className="pt-4 px-3.5 text-stone-800" style={{ fontSize }}>
        {value}
      </span>
    </div>
  );
};

export default Display;
