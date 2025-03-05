import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { Button } from "./Button";

describe("Button Component", () => {
  test("renders button with children text", () => {
    render(<Button>Press me</Button>);

    const buttonText = screen.getByText("Press me");
    expect(buttonText).toBeTruthy();
  });

  test("calls onPress when button is pressed", () => {
    const mockOnPress = jest.fn();
    render(<Button onPress={mockOnPress}>Click</Button>);

    const button = screen.getByText("Click");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test("does not call onPress when button is disabled", () => {
    const mockOnPress = jest.fn();
    render(
      <Button onPress={mockOnPress} disabled>
        Click
      </Button>,
    );

    const button = screen.getByText("Click");
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test("shows loading indicator when loading prop is true", () => {
    render(<Button loading>Loading</Button>);

    const loadingIndicator = screen.getByTestId("button");
    expect(loadingIndicator).toBeTruthy();
  });

  test("renders different variants correctly", () => {
    const { rerender } = render(<Button variant="filled">Filled</Button>);
    let button = screen.getByText("Filled");
    expect(button).toBeTruthy();

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByText("Outline");
    expect(button).toBeTruthy();

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByText("Ghost");
    expect(button).toBeTruthy();
  });

  test("renders different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByText("Small");
    expect(button).toBeTruthy();

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByText("Medium");
    expect(button).toBeTruthy();

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByText("Large");
    expect(button).toBeTruthy();
  });
});
