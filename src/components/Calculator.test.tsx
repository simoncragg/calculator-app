import "@testing-library/jest-dom"
import { render, fireEvent, waitFor, screen } from "@testing-library/react"
import Calculator from "./Calculator"
import { INVERT_SYMBOL } from "../constants";

test("displays zero on start up", async () => {
  render(<Calculator />);
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});

test("does not display an operator indicator on start up", async () => {
  render(<Calculator />);
  await assertElementIsHidden("operator-indicator");
});

test("does not display the equals indicator on start up", async () => {
  render(<Calculator />);
  await assertElementIsHidden("equals-indicator");
});

test.each([
  {inputs: "123456789", expected: "123,456,789"},
  {inputs: "1.23456789", expected: "1.23456789"}
])("operand cannot exceed 9 digits: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "0", expected: "0"},
  {inputs: "00", expected: "0"},
  {inputs: "01", expected: "1"},
  {inputs: "123", expected: "123"},
])("can enter integer operand: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "0.0", expected: "0.0"},
  {inputs: ".0", expected: "0.0"},
  {inputs: "0.00", expected: "0.00"},
  {inputs: "0.009", expected: "0.009"},
  {inputs: "12.0210", expected: "12.0210"},
])("can enter decimal operand: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
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
])("can do arithmetic: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
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
])("can display MDAS simplification steps when an operator is selected: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "10I", expected: "-10"},
  {inputs: "0.1×10I=", expected: "-1"},
  {inputs: "10II", expected: "10"},
  {inputs: "10I+10=", expected: "0"},
  {inputs: "10I+10I=", expected: "-20"},
  {inputs: "10II+10I=", expected: "0"},
  {inputs: "10I+10I=I", expected: "20"},
  {inputs: "10I+10I=I−10=I÷2=I×3I=", expected: "-15"},
  {inputs: "1÷0=I", expected: "Error"},
])("can invert number: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "500%", expected: "5"},
  {inputs: "50%", expected: "0.5"},
  {inputs: "5%", expected: "0.05"},
  {inputs: "0.5%", expected: "0.005"}
])("can calculate decimal percentage of a single operand in relation to 100: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "100+50%", expected: "50"},
  {inputs: "100+200%", expected: "200"},
  {inputs: "300+25%", expected: "75"},
])("can calculate percentage of current operand in relation to the last operand: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "100+50%=", expected: "150"},
  {inputs: "100−50%=", expected: "50"},
  {inputs: "100×10%=", expected: "1,000"},
  {inputs: "100÷10%=", expected: "10"},
])("can perform arithmetic operations with percentage: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "A", expected: "0"},
  {inputs: "5C", expected: "0"},
  {inputs: "5+5C6", expected: "6"},
  {inputs: "5+5C6=", expected: "11"},
  {inputs: "5+5CA", expected: "0"},
])("can clear memory: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
  await assertElementIsHidden("operator-indicator");
  if (!inputs.endsWith("=")) {
    await assertElementIsHidden("equals-indicator");
  }
});

test.each([
  "5+C",
  "5÷5CA"
])("can clear operator indicators: $inputs [$expected]", async (inputs) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertElementIsHidden("operator-indicator");
});

test.each([
  "1+1=C",
  "5÷5=CA"
])("can clear equals indicators: $inputs [$expected]", async (inputs) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertElementIsHidden("equals-indicator");
});

test.each([
  {inputs: "4+4====", expected: "20"},
  {inputs: "20−4====", expected: "4"},
  {inputs: "4×2====", expected: "64"},
  {inputs: "64÷2====", expected: "4"},
  {inputs: "5+5===÷4=", expected: "5"},
])("can repeat last operation: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "999999999+1=", expected: "1e9"},
  {inputs: "999999999+2=", expected: "1e9"},
  {inputs: "0.00000001÷100=", expected: "1e-10"},
  {inputs: "0.00000001÷100×1000=", expected: "1e-7"}, 
])("can display longer numbers using low precision exponential notation: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "0.00000001÷100×100=", expected: "0.00000001"},
  {inputs: "0.00000001÷10×10=", expected: "0.00000001"},
])("can display exponential results using fixed-point notation when short enough: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "÷×+−+5=", expected: "5"},
  {inputs: "÷×+−+−5=", expected: "-5"},
  {inputs: "2÷×+−+×÷1=", expected: "2"},
  {inputs: "1÷×+−+×2=", expected: "2"}
])("can handle consecutive operation selections: $inputs [$expected]", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "+", expected: "+"},
  {inputs: "−", expected: "−"},
  {inputs: "×", expected: "×"},
  {inputs: "÷", expected: "÷"},
])("can display the correct operator indicator when an operator is pressed", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOperatorIndicatorIsDisplayed(expected);
});

test.each([
  "+3",
  "−3",
  "×3",
  "÷3",
])("operator indicator is hidden when an operand is pressed", async (inputs) => {
  render(<Calculator />);
  pressButtons(inputs);
  const indicatorEl = screen.queryByTestId("operator-indicator");
  await waitFor(() => indicatorEl);
  expect(indicatorEl).not.toBeInTheDocument();
});

test("the equals indicator is displayed when the equals button is pressed", async () => {
  render(<Calculator />);
  pressButtons("1+1=");
  const indicatorEl = screen.queryByTestId("equals-indicator");
  await waitFor(() => indicatorEl);
  expect(indicatorEl).toBeInTheDocument();
});

test("the equals indicator is hidden when an operand pressed", async () => {
  render(<Calculator />);
  pressButtons("=3");
  await assertElementIsHidden("equals-operator");
});

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

const assertOperatorIndicatorIsDisplayed = async (expectedSymbol: string) => {
  const indicatorEl = screen.getByTestId("operator-indicator");
  await waitFor(() => indicatorEl);
  expect(indicatorEl).toHaveTextContent(expectedSymbol);
};

const assertElementIsHidden = async (testId: string) => {
  const el = screen.queryByTestId(testId);
  await waitFor(() => el);
  expect(el).not.toBeInTheDocument();
};
