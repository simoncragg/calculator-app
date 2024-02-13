import { useReducer } from "react";
import Screen from "./Screen";
import Button from "./Button";
import OperatorButton from "./OperatorButton";
import { ActionTypes, calcReducer } from "../reducers/calcReducer";
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

  const handleClearButtonClick = (e) => {
    const actionType = e.target.innerHTML === "AC"
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

  const handleDigitButtonClick = (e) => {
    dispatch({ type: ActionTypes.UPDATE_CURRENT_OPERAND, payload: { digit: e.target.innerHTML }});
  };

  const handleOperatorButtonClick = (e) => {
    dispatch({ type: ActionTypes.UPDATE_EXPRESSION, payload: { operator: e.target.getAttribute("data-operator") }});
  };

  const handleEqualsButtonClick = () => {
    dispatch({ type: ActionTypes.EVALUATE_EXPRESSION });
  };

  return (
    //console.log(calc),
    <>
      <div className="calculator">
        <Screen value={calc.output} />
        <div className="buttonBox">
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
          <Button className="span-two" onClick={handleDigitButtonClick}>0</Button>
          <Button onClick={handleDigitButtonClick}>.</Button>
          <Button onClick={handleEqualsButtonClick} className="sign">=</Button>
        </div>
      </div>
    </>
  );
};

export default Calculator;
