import { render, screen } from "@testing-library/react-native";
import { User, X } from "lucide-react-native";
import React from "react";

import { TextInput } from "./TextInput";

describe("TextInput Component", () => {
  it("renders basic textInput component", () => {
    render(<TextInput placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeTruthy();
  });

  it("renders label when provided", () => {
    render(<TextInput label="Email" placeholder="Enter Email" />);
    const input = screen.getByText("Email");
    expect(input).toBeTruthy();
  });

  it("renders error message when error prop is passed", () => {
    render(<TextInput error="Invalid input" />);

    const errorText = screen.getByText("Invalid input");
    expect(errorText).toBeTruthy();
  });
  it("renders left icon from lucide-react-native", () => {
    render(<TextInput leftIcon={<User color="black" size={24} />} />);

    const iconComponent = screen.getByTestId("text-input");
    expect(iconComponent).toBeTruthy();
  });

  it("renders right icon from lucide-react-native", () => {
    render(<TextInput rightIcon={<X color="red" size={24} />} />);

    const iconComponent = screen.getByTestId("text-input");
    expect(iconComponent).toBeTruthy();
  });

  test("handles disabled state", () => {
    render(<TextInput editable={false} testID="text-input" />);

    const input = screen.getByTestId("text-input");
    expect(input.props.editable).toBe(false);
  });
});
