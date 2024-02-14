export interface CalcState {
  currentOperand: string,
  expression: string,
  operator?: string,
  lastOperation?: string,
  lastInput?: string,
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
