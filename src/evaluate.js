import { 
    create, 
    evaluateDependencies, 
    factory,
    unaryMinusDependencies,
  } from 'mathjs/number'

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const createOperation = (operationName, operationFn) => factory(operationName, [], () => operationFn);

const { evaluate } = create({
  evaluateDependencies, 
  unaryMinusDependencies,
  createAdd: createOperation('add', add),
  createSubtract: createOperation('subtract', subtract),
  createMultiply: createOperation('multiply', multiply),
  createDivide: createOperation('divide', divide),
});

export default evaluate;
