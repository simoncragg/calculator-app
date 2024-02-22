export interface CalcState {
  currentOperand: string,
  expression: string[],
  lastInput?: string,
  lastOperand?: string;
  lastOperation?: string,
  output: string;
  voltageLevel: number;
}
  
export interface Action {
  type: string;
  payload?: UpdateCurrentOperandPayload | UpdateExpressionPayload | AdjustVoltagePayload;
}

export interface UpdateCurrentOperandPayload {
  digit: string;
}
  
export interface UpdateExpressionPayload {
  operator: string;
}

export interface AdjustVoltagePayload {
  voltageLevel: number;
}

export interface GetLastOperatorResultType {
  lastOperator: string | undefined,
  index: number
};
