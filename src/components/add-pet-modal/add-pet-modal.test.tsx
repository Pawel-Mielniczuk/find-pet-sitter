import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { usePets } from "../../context/PetsContext";
import { PET_TYPES } from "../../lib/types";
import { AddPetModal } from "./add-pet-modal";

jest.mock("@/src/context/PetsContext", () => ({
  usePets: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

jest.mock("lucide-react-native", () => ({
  Camera: "Camera",
  ChevronDown: "ChevronDown",
  X: jest.fn(() => <div>X Mock</div>),
}));

describe("AddPetModal", () => {
  const mockSetModalVisible = jest.fn();
  const mockSetNewPet = jest.fn();
  const mockSetTypeModalVisible = jest.fn();
  const mockHandleAddPet = jest.fn();

  const defaultProps = {
    modalVisible: true,
    setModalVisible: mockSetModalVisible,
    newPet: {
      name: "",
      type: "",
      breed: "",
      age: "",
      image: "https://example.com/pet.jpg",
      weight: null,
      special_instructions: "",
      custom_type: "",
    },
    setNewPet: mockSetNewPet,
    setTypeModalVisible: mockSetTypeModalVisible,
    errors: {},
    handleAddPet: mockHandleAddPet,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePets as jest.Mock).mockReturnValue(defaultProps);
  });

  it("renders correctly when modal is visible", () => {
    render(<AddPetModal />);

    expect(screen.getByText("Add a New Pet")).toBeTruthy();
    expect(screen.getByText("Select pet type")).toBeTruthy();
    expect(screen.getByText("Add Pet")).toBeTruthy();
  });

  it("does not render when modal is not visible", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      modalVisible: false,
    });

    render(<AddPetModal />);
    expect(screen.queryByText("Add a New Pet")).toBeNull();
  });

  it("updates pet name when input changes", () => {
    render(<AddPetModal />);

    fireEvent.changeText(screen.getByPlaceholderText("Enter your pet's name"), "Buddy");

    expect(mockSetNewPet).toHaveBeenCalledWith({
      ...defaultProps.newPet,
      name: "Buddy",
    });
  });

  it("opens type modal when dropdown is pressed", () => {
    render(<AddPetModal />);

    fireEvent.press(screen.getByText("Select pet type"));

    expect(mockSetTypeModalVisible).toHaveBeenCalledWith(true);
  });

  it('renders "Other" type field when type is "Other"', () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: "Other",
      },
    });

    render(<AddPetModal />);

    expect(screen.getByPlaceholderText("E.g., Ferret, Mantis, Hedgehog")).toBeTruthy();
  });

  it('does not render "Other" type field when type is not "Other"', () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: "Dog",
      },
    });

    render(<AddPetModal />);

    expect(screen.queryByPlaceholderText("E.g., Ferret, Mantis, Hedgehog")).toBeNull();
  });

  it("shows weight field for dogs only", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: PET_TYPES.Dog,
      },
    });

    render(<AddPetModal />);
    expect(screen.getByPlaceholderText("Enter your dog's weight")).toBeTruthy();

    screen.unmount();

    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: PET_TYPES.Cat,
      },
    });

    render(<AddPetModal />);
    expect(screen.queryByPlaceholderText("Enter your dog's weight")).toBeNull();
  });

  it("calls handleAddPet when Add Pet button is pressed", () => {
    render(<AddPetModal />);

    fireEvent.press(screen.getByText("Add Pet"));

    expect(mockHandleAddPet).toHaveBeenCalled();
  });

  it("displays error messages when provided", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      errors: {
        name: "Pet name is required",
        type: "Pet type is required",
      },
    });

    render(<AddPetModal />);

    expect(screen.getByText("Pet name is required")).toBeTruthy();
    expect(screen.getByText("Pet type is required")).toBeTruthy();
  });

  it("shows loading state when isLoading is true", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      isLoading: true,
    });

    render(<AddPetModal />);

    const button = screen.getByTestId("button");
    expect(button).toBeTruthy();

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("handles weight input correctly", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: PET_TYPES.Dog,
      },
    });

    render(<AddPetModal />);

    fireEvent.changeText(screen.getByPlaceholderText("Enter your dog's weight"), "15");

    expect(mockSetNewPet).toHaveBeenCalledWith({
      ...defaultProps.newPet,
      type: PET_TYPES.Dog,
      weight: 15,
    });
  });

  it("handles invalid weight input correctly", () => {
    (usePets as jest.Mock).mockReturnValue({
      ...defaultProps,
      newPet: {
        ...defaultProps.newPet,
        type: PET_TYPES.Dog,
      },
    });

    render(<AddPetModal />);

    fireEvent.changeText(screen.getByPlaceholderText("Enter your dog's weight"), "abc");

    expect(mockSetNewPet).toHaveBeenCalledWith({
      ...defaultProps.newPet,
      type: PET_TYPES.Dog,
      weight: null,
    });
  });

  test("updates special instructions when input changes", () => {
    render(<AddPetModal />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Any special care instructions for your pet"),
      "Needs daily medication",
    );

    expect(mockSetNewPet).toHaveBeenCalledWith({
      ...defaultProps.newPet,
      special_instructions: "Needs daily medication",
    });
  });
});
