import { useState, useEffect } from "react";
import Screen from "./Screen";
import Button from "./Button";

export const MAX_DIGITS = 16;

const Calculator = () => {
  
  const [calc, setCalc] = useState({});
  
  useEffect(() => {
    setCalc({
      currentOperand: "0",
      output: "0",
    });
  }, []);

  const updateCurrentOperand = (e) => {
    if (calc.currentOperand.replace(".", "").length >= MAX_DIGITS) return;

    const digit = e.target.innerHTML;
    if (digit === "." && calc.currentOperand.includes(".")) return;
    
    const isFirstDigit = (calc.currentOperand === "0" && digit !== ".");
    const currentOperand = (isFirstDigit) ? digit : calc.currentOperand + digit;
    setCalc({
      ...calc,
      currentOperand,
      output: formatNumber(currentOperand),
    });
  };

  const formatNumber = (strNumber) => {
    const numberParts = strNumber.split(".");
    const integerPart = parseInt(numberParts[0]).toLocaleString("en", { maximumFractionDigits: 0});
    const fractionalPart = numberParts.length > 1 ? numberParts[1] : "";
    return (strNumber.includes(".")) 
      ? `${integerPart}.${fractionalPart}`
      : integerPart;
  };

  return (
    <>
      <div className="calculator">
        <Screen value={calc.output} />
        <div className="buttonBox">
          <Button className="fn">AC</Button>
          <Button className="fn">+/-</Button>
          <Button className="fn">%</Button>
          <Button className="sign">÷</Button>
          <Button onClick={updateCurrentOperand}>7</Button>
          <Button onClick={updateCurrentOperand}>8</Button>
          <Button onClick={updateCurrentOperand}>9</Button>
          <Button className="sign">×</Button>
          <Button onClick={updateCurrentOperand}>4</Button>
          <Button onClick={updateCurrentOperand}>5</Button>
          <Button onClick={updateCurrentOperand}>6</Button>
          <Button className="sign">-</Button>
          <Button onClick={updateCurrentOperand}>1</Button>
          <Button onClick={updateCurrentOperand}>2</Button>
          <Button onClick={updateCurrentOperand}>3</Button>
          <Button className="sign">+</Button>
          <Button className="span-two" onClick={updateCurrentOperand}>0</Button>
          <Button onClick={updateCurrentOperand}>.</Button>
          <Button>=</Button>
        </div>
      </div>
    </>
  );
};

export default Calculator;
