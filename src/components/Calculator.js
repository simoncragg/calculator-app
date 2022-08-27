import { useState, useEffect } from "react";
import Button from "./Button";

const Calculator = () => {

  const [calc, setCalc] = useState({});

  useEffect(() => {
    setCalc({
      output: "0"
    });
  }, []);

  const handleDigit = (e) => {
    const digit = e.target.innerHTML;
    console.log(digit);
  };

  return (
    <>
      <div className="calculator">
        <div className="screen" data-testid="output">{calc.output}</div>
        <div className="buttonBox">
          <Button className="fn">AC</Button>
          <Button className="fn">+/-</Button>
          <Button className="fn">%</Button>
          <Button className="sign">÷</Button>
          <Button onClick={handleDigit}>7</Button>
          <Button onClick={handleDigit}>8</Button>
          <Button onClick={handleDigit}>9</Button>
          <Button className="sign">×</Button>
          <Button onClick={handleDigit}>4</Button>
          <Button onClick={handleDigit}>5</Button>
          <Button onClick={handleDigit}>6</Button>
          <Button className="sign">−</Button>
          <Button onClick={handleDigit}>1</Button>
          <Button onClick={handleDigit}>2</Button>
          <Button onClick={handleDigit}>3</Button>
          <Button className="sign">+</Button>
          <Button onClick={handleDigit} className="span-two">0</Button>
          <Button onClick={handleDigit}>.</Button>
          <Button>=</Button>
        </div>
      </div>
    </>
  );
};

export default Calculator;
