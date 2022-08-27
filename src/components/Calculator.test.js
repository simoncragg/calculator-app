import React from "react"
import {render, fireEvent, waitFor, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import Calculator from "./Calculator"

test("displays zero on start up", async () => {
  render(<Calculator />);
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});

test.each([
  {inputs: "12345678901234567", expected: "1,234,567,890,123,456"},
  {inputs: "1.2345678901234567", expected: "1.234567890123456"}
])("operand cannot exceed 16 digits", async ({inputs, expected}) => {
  render(<Calculator />);
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

test.each([
  {inputs: "0", expected: "0"},
  {inputs: "00", expected: "0"},
  {inputs: "01", expected: "1"},
  {inputs: "123", expected: "123"},
])("can enter integer operand $inputs -> $expected", async ({inputs, expected}) => {
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
])("can enter decimal operand $inputs [$expected]", async ({inputs, expected}) => {
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
  fireEvent.click(screen.getByRole("button", { name }));
};

const assertOutputIsEqualTo = async (expected) => {
  const outputEl = screen.getByTestId("output");
  await waitFor(() => outputEl);
  expect(outputEl).toHaveTextContent(expected);
};