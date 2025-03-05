import { render, screen } from "@testing-library/react-native";
import React from "react";

import { OnboardingSlide } from "./onboarding-slide";

describe("OnboardingSlide Component", () => {
  const mockProps = {
    title: "Test Title",
    description: "Test Description",
    image: "https://example.com/test-image.jpg",
  };

  test("renders title correctly", () => {
    render(<OnboardingSlide {...mockProps} />);

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toBeTruthy();
  });

  test("renders description correctly", () => {
    render(<OnboardingSlide {...mockProps} />);

    const descriptionElement = screen.getByText("Test Description");
    expect(descriptionElement).toBeTruthy();
  });

  test("renders image with correct source", () => {
    render(<OnboardingSlide {...mockProps} />);

    const image = screen.getByTestId("onboarding-image");
    expect(image.props.source.uri).toBe("https://example.com/test-image.jpg");
  });

  test("image has correct resize mode", () => {
    render(<OnboardingSlide {...mockProps} />);

    const image = screen.getByTestId("onboarding-image");
    expect(image.props.resizeMode).toBe("cover");
  });
});
