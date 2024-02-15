import { useReducer } from "react";
import Screen from "./Screen";
import Button from "./Button";
import OperatorButton from "./OperatorButton";
import calcReducer, { ActionTypes } from "../reducers/calcReducer";
import { INVERT_SYMBOL } from "../constants";

const Calculator = () => {
  
  const initialState = {
      currentOperand: "0",
      expression: "",
      lastOperation: undefined,
      lastInput: undefined,
      output: "0",
  };

  const [calc, dispatch] = useReducer(calcReducer, initialState);

  const handleClearButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { innerHTML } = e.target as HTMLButtonElement; 
    const actionType = innerHTML === "AC"
      ? ActionTypes.ALL_CLEAR
      : ActionTypes.CLEAR;
    dispatch({ type: actionType });
  };

  const handleInvertNumberButtonClick = () => {
    dispatch({ type: ActionTypes.INVERT_NUMBER });
  };

  const handleCalculatePercentButtonClick = () => {
    dispatch({ type: ActionTypes.CALCULATE_PERCENT });
  };

  const handleDigitButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { innerHTML } = e.target as HTMLButtonElement; 
    dispatch({ type: ActionTypes.UPDATE_CURRENT_OPERAND, payload: { digit: innerHTML }});
  };

  const handleOperatorButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const operator = (e.target as HTMLButtonElement).getAttribute("data-operator")!;
    dispatch({ type: ActionTypes.UPDATE_EXPRESSION, payload: { operator }});
  };

  const handleEqualsButtonClick = () => {
    dispatch({ type: ActionTypes.EVALUATE_EXPRESSION });
  };

  return (
    <div className="calculator">
        <Screen value={calc.output} />
        <div className="w-full h-[80%] grid grid-cols-4 grid-rows-5 gap-2.5">
          <Button className="fn" onClick={handleClearButtonClick}>{calc.output === "0" ? "AC" : "C"}</Button>
          <Button className="fn" onClick={handleInvertNumberButtonClick}>{INVERT_SYMBOL}</Button>
          <Button className="fn" onClick={handleCalculatePercentButtonClick}>%</Button>
          <OperatorButton op="/" lastInput={calc.lastInput} onClick={handleOperatorButtonClick}>÷</OperatorButton>
          <Button onClick={handleDigitButtonClick}>7</Button>
          <Button onClick={handleDigitButtonClick}>8</Button>
          <Button onClick={handleDigitButtonClick}>9</Button>
          <OperatorButton op="*" lastInput={calc.lastInput} onClick={handleOperatorButtonClick}>×</OperatorButton>
          <Button onClick={handleDigitButtonClick}>4</Button>
          <Button onClick={handleDigitButtonClick}>5</Button>
          <Button onClick={handleDigitButtonClick}>6</Button>
          <OperatorButton op="-" lastInput={calc.lastInput} onClick={handleOperatorButtonClick}>−</OperatorButton>
          <Button onClick={handleDigitButtonClick}>1</Button>
          <Button onClick={handleDigitButtonClick}>2</Button>
          <Button onClick={handleDigitButtonClick}>3</Button>
          <OperatorButton op="+" lastInput={calc.lastInput} onClick={handleOperatorButtonClick}>+</OperatorButton>
          <Button className="col-span-2 text-left pl-8" onClick={handleDigitButtonClick}>0</Button>
          <Button onClick={handleDigitButtonClick}>.</Button>
          <Button onClick={handleEqualsButtonClick} className="sign">=</Button>
        </div>
      </div>
  );
};

export default Calculator;