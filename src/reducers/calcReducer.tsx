import type {
  Action,
  AdjustVoltagePayload,
  CalcState,
  GetLastOperatorResultType,
  UpdateCurrentOperandPayload,
  UpdateExpressionPayload
} from "../types";

import evaluate from '../utils/evaluate';
import formatNumberString from "../utils/formatNumberString";
import getDigitCount from "../utils/getDigitCount";
import { ActionTypes, INVERT_SYMBOL, MAX_DIGITS } from '../constants';

export default function calcReducer(calc: CalcState, action: Action): CalcState {

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

    case ActionTypes.ADJUST_VOLTAGE:
      const { voltageLevel } = action.payload as AdjustVoltagePayload;
      return adjustVoltage(calc, voltageLevel);

    default:
      return calc;
  }
}

function allClear(): CalcState {
  return {
    expression: [],
    currentOperand: "0",
    output: "0",
    voltageLevel: 1.0,
  };
}

function clear(calc: CalcState): CalcState {
  return {
    ...calc,
    currentOperand: "0",
    lastInput: "AC",
    lastOperand: undefined,
    lastOperation: undefined,
    output: "0",
  };
}

function invertNumber(calc: CalcState): CalcState {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;

  const invertedNumber = parseFloat(calc.currentOperand) * -1;
  const strInvertedNumber = invertedNumber.toString();
  const output = formatNumberString(strInvertedNumber, { maxDigits: MAX_DIGITS });

  return {
    ...calc,
    currentOperand: strInvertedNumber,
    lastInput: INVERT_SYMBOL,
    output,
  };
}

function calculatePercent(calc: CalcState): CalcState {
  if (calc.lastInput === "=" && calc.output === "Error") return calc;

  const percentResult = calc.lastOperand
    ? parseFloat(calc.currentOperand) * parseFloat(calc.lastOperand) / 100
    : parseFloat(calc.currentOperand) / 100;

  const strPercentResult = percentResult.toString();
  const output = formatNumberString(strPercentResult, { maxDigits: MAX_DIGITS });

  return {
    ...calc,
    currentOperand: strPercentResult,
    lastInput: "%",
    output,
  };
}

function updateCurrentOperand (calc: CalcState, digit: string): CalcState {
  if (getDigitCount(calc.currentOperand) === MAX_DIGITS) return calc;
  if (digit === "." && calc.currentOperand.includes(".")) return calc;

  const isFirstDigit = calc.currentOperand === "0" && digit !== "." || calc.lastInput === "=";
  const currentOperand = isFirstDigit ? digit : calc.currentOperand + digit;
  const output = formatNumberString(currentOperand, { maxDigits: MAX_DIGITS });

  return {
    ...calc,
    currentOperand,
    lastInput: digit,
    output,
  };
}

function updateExpression (calc: CalcState, newOperator: string): CalcState {
  if (newOperator === calc.lastInput) return calc;

  const expression = calc.currentOperand !== ""
    ? [...calc.expression, calc.currentOperand]
    : calc.expression.slice(0, -1);

  const operand = calc.currentOperand !== ""
    ? calc.currentOperand
    : calc.lastOperand ?? "0";

  const output = buildOutputForNewOperator(operand, expression, newOperator);

  return {
    ...calc,
    currentOperand: "",
    expression: [...expression, newOperator],
    lastOperand: operand,
    lastInput: newOperator,
    output,
  };
}

function evaluateExpression (calc: CalcState): CalcState {
  if (calc.lastInput === "=") return repeatLastOperation(calc);
  
  const currentOperand = calc.currentOperand ? calc.currentOperand : calc.lastOperand!;
  const expression = [...calc.expression, currentOperand].join("");
  const result = evaluate(expression).toString();
  const lastOperation = getLastOperation(calc.expression, currentOperand);
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true });

  return {
    ...calc,
    currentOperand: result,
    expression: [],
    lastOperation,
    lastInput: "=",
    output,
  };
}

function repeatLastOperation(calc: CalcState): CalcState {
  const result = evaluate(calc.currentOperand + calc.lastOperation).toString();
  const output = formatNumberString(result, { maxDigits: MAX_DIGITS, useRounding: true });

  return {
    ...calc,
    currentOperand: result,
    output,
  };
}

function adjustVoltage(calc: CalcState, voltageLevel: number): CalcState {
  return {
    ...calc,
    voltageLevel,
  }
} 

function getLastOperation(expression: string[], currentOperand: string): string {
  const { lastOperator, index } = getLastOperator(expression);
  const lastOperation = lastOperator
    ? [...expression.slice(index), currentOperand]
    : [];

  return lastOperation.join("");
}

function buildOutputForNewOperator(operand: string, expression: string[], newOperator: string): string {
  const expressionToEvaluate = getExpressionToEvaluate(expression, newOperator);
  if (expressionToEvaluate) {
    const evaluation = evaluate(expressionToEvaluate);
    return formatNumberString(evaluation.toString(), { maxDigits: MAX_DIGITS });
  }

  return formatNumberString(operand, { maxDigits: MAX_DIGITS });
}

function getExpressionToEvaluate(expression: string[], newOperator: string): string | undefined {
  let { lastOperator, index } = getLastOperator(expression);

  if (!lastOperator) return undefined;
  if (isDivideOrMultiply(newOperator) && isAddOrSubtract(lastOperator)) return undefined;

  return expression
    .slice(index - 1)
    .join("");
}

function getLastOperator(expression: string[]): GetLastOperatorResultType {
  for (let i = expression.length - 1; i > -1; i--) {
    if (isOperator(expression[i])) {
      return { 
        lastOperator: expression[i],
        index: i
      };
    }
  }
  
  return { 
    lastOperator: undefined,
    index: -1
  };
}
 
function isOperator(candidate: string | undefined): boolean {
  return candidate 
    ? "/*-+".includes(candidate)
    : false;
}

function isAddOrSubtract(operator: string): boolean {
  return "+-".indexOf(operator) > -1;
}

function isDivideOrMultiply(operator: string): boolean {
  return "/*".indexOf(operator) > -1;
}