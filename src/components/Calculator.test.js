import React from "react"
import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import Calculator from "./Calculator"

test("displays zero on start up", async () => {
  render(<Calculator />);
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});
