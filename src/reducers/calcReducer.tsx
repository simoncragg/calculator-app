import type {
  Action,
  CalcState,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import evaluate from '../utils/evaluate';
import formatNumberString from "../utils/formatNumberString";
import { ActionTypes, INVERT_SYMBOL, MAX_DIGITS } from '../constants';

export default function calcReducer(calc: CalcState, action: Action) {

  switch (action.type) {

    case ActionTypes.ALL_CLEAR:
      return allClear();

    case ActionTypes.CLEAR:
      return clear(calc);

    case ActionTypes.INVERT_NUMBER:
      return invertNumber(calc);

    case ActionTypes.CALCULATE_PERCENT:
      return calculatePercent(calc);

    case ActionTypes.UPDATE_CURRENT_OPERAND:
      const { digit } = action.payload as UpdateCurrentOperandPayload; 
      return updateCurrentOperand(calc, digit);

    case ActionTypes.UPDATE_EXPRESSION:
      const { operator } = action.payload as UpdateExpressionPayload; 
      return updateExpression(calc, operator);

    case ActionTypes.EVALUATE_EXPRESSION:
      return evaluateExpression(calc);

    default:
      return calc;
  }
}

function allClear() {
  return {
    currentOperand: "0",
    expression: "",
    operator: undefined,
    lastInput: undefined,
    lastOperand: undefined,
    lastOperation: undefined,
    output: "0"
  };
}

function clear(calc: CalcState) {
  return {
    ...calc,
    currentOperand: "0",
    lastInput: "AC",
    lastOperand: undefined,
    lastOperation: undefined,
    output: "0"
  };
}

function invertNumber(calc: CalcState) {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;
  const invertedNumber = parseFloat(calc.currentOperand) * -1;
  const strInvertedNumber = invertedNumber.toString();
  return {
    ...calc,
    currentOperand: strInvertedNumber,
    lastInput: INVERT_SYMBOL,
    output: formatNumberString(strInvertedNumber, { maxDigits: MAX_DIGITS })
  };
}

function calculatePercent(calc: CalcState) {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;
  const percentResult = parseFloat(calc.currentOperand) / 100;
  const strPercentResult = percentResult.toString();
  return {
    ...calc,
    currentOperand: strPercentResult,
    lastInput: "%",
    output: formatNumberString(strPercentResult, { maxDigits: MAX_DIGITS })
  };
}

function updateCurrentOperand (calc: CalcState, digit: string) {
  if (calc.currentOperand.replace(".", "").length === MAX_DIGITS) return calc;
  if (digit === "." && calc.currentOperand.includes(".")) return calc;
  
  const isFirstDigit = calc.currentOperand === "0" && digit !== "." || calc.lastInput === "=";
  const currentOperand = isFirstDigit ? digit : calc.currentOperand + digit;

  return {
    ...calc,
    currentOperand,
    lastInput: digit,
    output: formatNumberString(currentOperand, { maxDigits: MAX_DIGITS })
  };
}

function updateExpression (calc: CalcState, newOperator: string): CalcState {
  if (newOperator === calc.lastInput) return calc;

  const expression = calc.currentOperand !== ""
    ? calc.expression + calc.currentOperand
    : calc.expression.substring(0, calc.expression.length - 1);
    
  const operand = calc.currentOperand !== ""
    ? calc.currentOperand
    : calc.lastOperand ?? "0";

  const output = buildOutputForNewOperator(operand, expression, newOperator);

  return {
    ...calc,
    currentOperand: "",
    expression: expression + newOperator,
    lastOperand: operand,
    lastInput: newOperator,
    output,
  };
}

function evaluateExpression (calc: CalcState) {
  if (calc.lastInput === "=") return repeatLastOperation(calc);
  const expression = calc.expression + calc.currentOperand;
  const result = evaluate(expression).toString();
  const lastOperation = getLastOperation(calc.expression, calc.currentOperand);
  return {
    ...calc,
    currentOperand: result,
    expression: "",
    lastOperation,
    lastInput: "=",
    output: formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true })
  };
}

function repeatLastOperation(calc: CalcState) {
  const result = evaluate(calc.currentOperand + calc.lastOperation).toString();
  return {
    ...calc,
    currentOperand: result,
    output: formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true })
  };
}

function getLastOperation(expression: string, currentOperand: string) {
  const { lastOperator, i } = getLastOperator(expression);
  const lastOperation = (lastOperator)
    ? expression.substring(i) + currentOperand
    : "";
  return lastOperation;
}

function buildOutputForNewOperator(operand: string, expression: string, newOperator: string) {
  const evaluationIndex = getEvaluationIndex(expression, newOperator);
  if (evaluationIndex > -1) {
    const evaluation = evaluate(expression.substring(evaluationIndex));
    return formatNumberString(evaluation.toString(), { maxDigits: MAX_DIGITS });
  }
  return formatNumberString(operand, { maxDigits: MAX_DIGITS });
}

function getEvaluationIndex(expression: string, newOperator: string) {
  const {lastOperator, i} = getLastOperator(expression);
  if (!lastOperator) return -1;
  if (isDivideOrMultiply(lastOperator) && isDivideOrMultiply(newOperator)) return i-1;
  if (isAddOrSubtract(lastOperator) && isAddOrSubtract(newOperator)) return 0;
  return -1;
}

function getLastOperator(expression: string) {
  for (let i = expression.length - 1; i > -1; i--) {
    if (isOperator(expression[i])) {
      return {lastOperator: expression[i], i};
    }
  }
  return {undefined, i: -1};
}

function isOperator(candidate: string | undefined) {
  return candidate && "/*-+".includes(candidate);
}

function isAddOrSubtract(operator: string) {
  return "+-".indexOf(operator) > -1;
}

function isDivideOrMultiply(operator: string) {
  return "/*".indexOf(operator) > -1;
}
