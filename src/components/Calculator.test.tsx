import "@testing-library/jest-dom"
import { render, fireEvent, waitFor, screen } from "@testing-library/react"
import Calculator from "./Calculator"
import { INVERT_SYMBOL } from "../constants";
import { CalculatorStoreProvider } from "../CalculatorStore";

it("displays zero on start up", async () => {
  renderCalculator();
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});

it("does not display an operator indicator on start up", async () => {
  renderCalculator();
  await assertElementIsHidden("operator-indicator");
});

it("does not display the equals indicator on start up", async () => {
  renderCalculator();
  await assertElementIsHidden("equals");
});

it.each([
  {inputs: "1234567890", expected: "123,456,789"},
  {inputs: "1.234567890", expected: "1.23456789"},
  {inputs: "1.234567890I", expected: "-1.23456789"},
  {inputs: "1.23I4567890", expected: "-1.23456789"}
])("limits the maximum length of an operand to 9 digits: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "0", expected: "0"},
  {inputs: "00", expected: "0"},
  {inputs: "01", expected: "1"},
  {inputs: "123", expected: "123"},
])("displays inputed integer operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "0.0", expected: "0.0"},
  {inputs: ".0", expected: "0.0"},
  {inputs: "0.00", expected: "0.00"},
  {inputs: "0.009", expected: "0.009"},
  {inputs: "12.0210", expected: "12.0210"},
])("displays inputed decimal operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "1+1=", expected: "2"},
  {inputs: "0.1+0.1=", expected: "0.2"},
  {inputs: ".01+0.01=", expected: "0.02"},
  {inputs: "32768.1638+16384.0819=", expected: "49,152.2457"},
  {inputs: "99+1=", expected: "100"},
  {inputs: "1−1=", expected: "0"},
  {inputs: ".01−.001=", expected: "0.009"},
  {inputs: "100−99=", expected: "1"},
  {inputs: "1×0=", expected: "0"},
  {inputs: "10×0.1=", expected: "1"},
  {inputs: "10.1×0.1=", expected: "1.01"},
  {inputs: "10×10=", expected: "100"},
  {inputs: "1÷0=", expected: "Error"},
  {inputs: "1÷1=", expected: "1"},
  {inputs: "10÷5=", expected: "2"},
  {inputs: "100÷0.5=", expected: "200"},
])("performs arithmetic: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "1+=", expected: "2"},
  {inputs: "2−=", expected: "0"},
  {inputs: "3×=", expected: "9"},
  {inputs: "4÷=", expected: "1"},
])("infers missing operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "5+5+", expected: "10"},
  {inputs: "5+5−", expected: "10"},
  {inputs: "5×5×", expected: "25"},
  {inputs: "5÷5÷", expected: "1"},
  {inputs: "5×5÷", expected: "25"},
  {inputs: "5÷5×", expected: "1"},
  {inputs: "5×5+", expected: "25"},
  {inputs: "5×5−", expected: "25"},
  {inputs: "5÷5+", expected: "1"},
  {inputs: "5÷5−", expected: "1"},
  {inputs: "5+5×", expected: "5"},
  {inputs: "5+5÷", expected: "5"},
  {inputs: "5−5×", expected: "5"},
  {inputs: "5−5÷", expected: "5"},
  {inputs: "5+5×5×", expected: "25"},
  {inputs: "5−5×5×", expected: "25"},
  {inputs: "5+5÷5×", expected: "1"},
  {inputs: "5−5÷5×", expected: "1"},
  {inputs: "300×2×", expected: "600"},
  {inputs: "300×100÷", expected: "30,000"},
  {inputs: "300÷2÷", expected: "150"},
  {inputs: "300÷100×", expected: "3"},
])("displays interim MDAS evaluation steps: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "10I", expected: "-10"},
  {inputs: "0.1×10I=", expected: "-1"},
  {inputs: "10II", expected: "10"},
  {inputs: "10I+10=", expected: "0"},
  {inputs: "10I+10I=", expected: "-20"},
  {inputs: "10II+10I=", expected: "0"},
  {inputs: "10I+10I=I", expected: "20"},
  {inputs: "10I+10I=I−10=I÷2=I×3I=", expected: "-15"},
  {inputs: "1÷0=I", expected: "Error"},
])("inverts a number when the invert function button is pressed: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "500%", expected: "5"},
  {inputs: "50%", expected: "0.5"},
  {inputs: "5%", expected: "0.05"},
  {inputs: "0.5%", expected: "0.005"}
])("correctly calculates the decimal percentage of a single operand in relation to 100: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "100+50%", expected: "50"},
  {inputs: "100+200%", expected: "200"},
  {inputs: "300+25%", expected: "75"},
])("correctly calculates the percentage of current operand in relation to the previous operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "100+50%=", expected: "150"},
  {inputs: "100−50%=", expected: "50"},
  {inputs: "100×10%=", expected: "1,000"},
  {inputs: "100÷10%=", expected: "10"},
])("performs arithmetic operations involving the percentage function: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "A", expected: "0"},
  {inputs: "5C", expected: "0"},
  {inputs: "5+5C6", expected: "6"},
  {inputs: "5+5C6=", expected: "11"},
  {inputs: "5+5CA", expected: "0"},
])("clears memory: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
  await assertElementIsHidden("operator-indicator");
  if (!inputs.endsWith("=")) {
    await assertElementIsHidden("equals-indicator");
  }
});

it.each([
  "5+C",
  "5÷5CA"
])("clears operator indicators: $inputs 🡢 $expected", async (inputs) => {
  renderCalculator();
  pressButtons(inputs);
  await assertElementIsHidden("operator-indicator");
});

it.each([
  "1+1=C",
  "5÷5=CA"
])("clears equals indicators: $inputs 🡢 $expected", async (inputs) => {
  renderCalculator();
  pressButtons(inputs);
  await assertElementIsHidden("equals-indicator");
});

it.each([
  {inputs: "4+4====", expected: "20"},
  {inputs: "20−4====", expected: "4"},
  {inputs: "4×2====", expected: "64"},
  {inputs: "64÷2====", expected: "4"},
  {inputs: "5+5===÷4=", expected: "5"},
  {inputs: "5+====", expected: "25"},
])("repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "999999999+1=", expected: "1e9"},
  {inputs: "999999999+2=", expected: "1e9"},
  {inputs: "0.00000001÷100=", expected: "1e-10"},
  {inputs: "0.00000001÷100×1000=", expected: "1e-7"}, 
])("displays longer numbers using low precision exponential notation: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "0.00000001÷100×100=", expected: "0.00000001"},
  {inputs: "0.00000001÷10×10=", expected: "0.00000001"},
])("displays exponential results using fixed-point notation when 9 digits or less: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "÷×+−+5=", expected: "5"},
  {inputs: "÷×+−+−5=", expected: "-5"},
  {inputs: "2÷×+−+×÷1=", expected: "2"},
  {inputs: "1÷×+−+×2=", expected: "2"}
])("handles consecutive operation selections: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: "+", expected: "Plus sign"},
  {inputs: "−", expected: "Minus sign"},
  {inputs: "×", expected: "Multiply sign"},
  {inputs: "÷", expected: "Divide by sign"},
])("displays the correct operator indicator when an operator is pressed", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOperatorIndicatorIsDisplayed(expected);
});

it.each([
  "+3",
  "−3",
  "×3",
  "÷3",
])("hides operator indicator when an operand is pressed", async (inputs) => {
  renderCalculator();
  pressButtons(inputs);
  const indicatorEl = screen.queryByTestId("operator-indicator");
  await waitFor(() => indicatorEl);
  expect(indicatorEl).not.toBeInTheDocument();
});

it("displays the equals indicator when the equals button is pressed", async () => {
  renderCalculator();
  pressButtons("1+1=");
  const indicatorEl = screen.queryByTestId("equals-indicator");
  await waitFor(() => indicatorEl);
  expect(indicatorEl).toBeInTheDocument();
});

it("hides the equals indicator when an operand pressed", async () => {
  renderCalculator();
  pressButtons("=3");
  await assertElementIsHidden("equals-operator");
});

const renderCalculator = () => {
  render(
    <CalculatorStoreProvider>
      <Calculator />
    </CalculatorStoreProvider>
  );
}

const pressButtons = (inputs: string) => {
  for (const input of inputs.split("")) {
    pressButton(input);
  }
};

const pressButton = (name: string) => {
  const mappedName = name === "A"
    ? "AC"
    : name === "I"
      ? INVERT_SYMBOL
      : name;

  fireEvent.click(screen.getByRole("button", { name: mappedName }));
};

const assertOutputIsEqualTo = async (expected: string) => {
  const outputEl = screen.getByTestId("output");
  await waitFor(() => outputEl);
  expect(outputEl).toHaveTextContent(expected);
};

const assertOperatorIndicatorIsDisplayed = async (expectedAriaLabel: string) => {
  const indicatorEl = screen.getByTestId('operator-indicator');
  await waitFor(() => indicatorEl);
  expect(indicatorEl).toHaveAccessibleName(expectedAriaLabel);
};

const assertElementIsHidden = async (testId: string) => {
  const el = screen.queryByTestId(testId);
  await waitFor(() => el);
  expect(el).not.toBeInTheDocument();
};
