import Calculator from "./Calculator";
import { CalculatorStoreProvider } from "../CalculatorStore";

const App = () => 
  <CalculatorStoreProvider>
    <Calculator />
  </CalculatorStoreProvider>;

export default App;
