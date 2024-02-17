export interface CalcState {
  currentOperand: string,
  expression: string,
  operator?: string,
  lastInput?: string,
  lastOperand?: string;
  lastOperation?: string,
  output: string;
}
  
export interface Action {
  type: string;
  payload?: UpdateCurrentOperandPayload | UpdateExpressionPayload;
}
  
export interface UpdateCurrentOperandPayload {
  digit: string;
}
  
export interface UpdateExpressionPayload {
  operator: string;
}
