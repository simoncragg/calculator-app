import React, { createContext, useContext, useReducer } from "react";
import calcReducer from "./reducers/calcReducer";
import type { Action, CalcState } from "./types";

interface ICalculatorContext {
    calc: CalcState;
    dispatch: (action: Action) => void;
}

interface CalculatorStoreProvider {
    children: React.ReactNode;
}

const initialState: CalcState = {
    currentOperand: "0",
    expression: [],
    output: "0",
};

const CalculatorStore = createContext({} as ICalculatorContext);

export const CalculatorStoreProvider = ({ children }: CalculatorStoreProvider) => {
  
    const [calc, dispatch] = useReducer(calcReducer, initialState);

    return (
        <CalculatorStore.Provider value={{calc, dispatch}}>
            {children}
        </CalculatorStore.Provider>
    );
}

export const useCalculator = () => useContext(CalculatorStore);
