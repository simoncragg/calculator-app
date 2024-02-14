import type {
  CalcState,
  Action,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import evaluate from '../evaluate';

import { 
  MAX_DIGITS, 
  INVERT_SYMBOL,
} from '../constants';

export const ActionTypes = {
  UPDATE_CURRENT_OPERAND: "UPDATE_CURRENT_OPERAND",
  UPDATE_EXPRESSION: "UPDATE_EXPRESSION",
  EVALUATE_EXPRESSION: "EVALUATE_EXPRESSION",
  INVERT_NUMBER: "INVERT_NUMBER",
  CALCULATE_PERCENT: "PERCENT",
  ALL_CLEAR: "ALL_CLEAR",
  CLEAR: "CLEAR"
};

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
    lastOperation: undefined,
    lastInput: undefined,
    output: "0"
  };
}

function clear(calc: CalcState) {
  return {
    ...calc,
    currentOperand: "0",
    lastOperation: undefined,
    lastInput: "AC",
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
    output: format(strInvertedNumber)
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
    output: format(strPercentResult)
  };
}

function updateCurrentOperand (calc: CalcState, digit: string) {
  if (calc.currentOperand.replace(".", "").length >= MAX_DIGITS) return calc;
  if (digit === "." && calc.currentOperand.includes(".")) return calc;
  
  const isFirstDigit = (calc.currentOperand === "0" && digit !== ".") || calc.lastInput === "=";
  const currentOperand = (isFirstDigit) ? digit : calc.currentOperand + digit;

  return {
    ...calc,
    currentOperand,
    lastInput: digit,
    output: format(currentOperand)
  };
}

function updateExpression (calc: CalcState, newOperator: string) {
  if (newOperator === calc.lastInput) return calc;

  const expression = isOperator(calc.lastInput)
    ? calc.expression.slice(-1)
    : calc.expression + calc.currentOperand;

  return {
    ...calc,
    currentOperand: "",
    expression: expression + newOperator,
    lastInput: newOperator,
    output: buildOutputForNewOperator(calc, expression, newOperator)
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
    output: format(round(result))
  };
}

function repeatLastOperation(calc: CalcState) {
  const result = evaluate(calc.currentOperand + calc.lastOperation).toString();
  return {
    ...calc,
    currentOperand: result,
    output: format(round(result))
  };
}

function getLastOperation(expression: string, currentOperand: string) {
  const { lastOperator, i } = getLastOperator(expression);
  return (lastOperator)
    ? expression.substring(i) + currentOperand
    : "";
}

function buildOutputForNewOperator(calc: CalcState, expression: string, newOperator: string) {
  const evaluationIndex = getEvaluationIndex(expression, newOperator);
  if (evaluationIndex > -1) {
    const evaluation = evaluate(expression.substring(evaluationIndex));
    return format(round(evaluation).toString());
  }
  return calc.currentOperand;
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

function format(strNumber: string) {
  if (isInfinity(strNumber)) return "Error";
  const numberParts = strNumber.split(".");
  const integerPart = parseInt(numberParts[0]).toLocaleString("en", { maximumFractionDigits: 0});
  const fractionalPart = numberParts.length > 1 ? numberParts[1] : "";
  return (strNumber.includes(".")) 
    ? `${integerPart}.${fractionalPart}`
    : integerPart;
}

function round(number: string) {
  if (isInfinity(number)) return number;
  const strNumber = number.toString();
  const floatNumber = parseFloat(strNumber);
  const fractionalDigits = computeFixedPointFractionDigits(strNumber)
  const fixedNumber = floatNumber.toFixed(fractionalDigits);
  const fixedNumberWithNoTrailingZeros = parseFloat(fixedNumber).toString();
  return fixedNumberWithNoTrailingZeros;
}

function computeFixedPointFractionDigits(strNumber: string) {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return MAX_DIGITS - numOfIntegerDigits;
}

function isInfinity (number: string) {
  return number === "Infinity";
}
