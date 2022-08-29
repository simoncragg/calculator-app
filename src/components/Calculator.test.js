import React from "react"
import {render, fireEvent, waitFor, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import Calculator from "./Calculator"
import { INVERT_SYMBOL } from "../constants";

test("displays zero on start up", async () => {
  render(<Calculator />);
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});

test.each([
  {inputs: "12345678901234567", expected: "1,234,567,890,123,456"},
  {inputs: "1.2345678901234567", expected: "1.234567890123456"}
])("operand cannot exceed 16 digits: $inputs [$expected]", async ({inputs, expected}) => {
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
  {inputs: "32768.16384812902+16384.08192406451=", expected: "49,152.24577219354"},
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
])("can do arithmetc: $inputs [$expected]", async ({inputs, expected}) => {
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
  {inputs: "5+5×", expected: "5"},
  {inputs: "5+5÷", expected: "5"},
  {inputs: "5−5×", expected: "5"},
  {inputs: "5−5÷", expected: "5"},
  {inputs: "5+5×5×", expected: "25"},
  {inputs: "5−5×5×", expected: "25"},
  {inputs: "5+5÷5×", expected: "1"},
  {inputs: "5−5÷5×", expected: "1"},
])("can display any MDAS simplification steps when an operator is selected: $inputs [$expected]", async ({inputs, expected}) => {
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
])("can calculate percent: $inputs [$expected]", async ({inputs, expected}) => {
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
});

const pressButtons = (inputs) => {
  for (const input of inputs.split("")) {
    pressButton(input);
  }
};

const pressButton = (name) => {
  const mappedName = name === "A"
    ? "AC"
    : name === "I"
      ? INVERT_SYMBOL
      : name;

  fireEvent.click(screen.getByRole("button", { name: mappedName }));
};

const assertOutputIsEqualTo = async (expected) => {
  const outputEl = screen.getByTestId("output");
  await waitFor(() => outputEl);
  expect(outputEl).toHaveTextContent(expected);
};