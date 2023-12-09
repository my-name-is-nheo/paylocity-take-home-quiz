import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

test("Button renders successfully", () => {
  render(<Button label="Test Button" />);

  const buttonElement = screen.getByText(/test button/i);

  expect(buttonElement).toBeInTheDocument();
});
