import { fireEvent, render, screen } from "@testing-library/react-native";

import { PET_TYPES } from "../../lib/types";
import { PetTypeModal } from "./pet-type-modal";

describe("PetTypeModal", () => {
  it("renders modal when visible is true", () => {
    render(
      <PetTypeModal
        visible={true}
        onClose={jest.fn()}
        onSelectType={jest.fn()}
        petTypes={Object.values(PET_TYPES)}
      />,
    );
    expect(screen.getByText("Select Pet Type")).toBeTruthy();
  });

  it("does not render modal when visible is false", () => {
    render(
      <PetTypeModal
        visible={false}
        onClose={jest.fn()}
        onSelectType={jest.fn()}
        petTypes={Object.values(PET_TYPES)}
      />,
    );
    expect(screen.queryByText("Select Pet Type")).toBeNull();
  });

  it("calls onSelectType with correct value when a type is selected", () => {
    const onSelectType = jest.fn();
    render(
      <PetTypeModal
        visible={true}
        onClose={jest.fn()}
        onSelectType={onSelectType}
        petTypes={Object.values(PET_TYPES)}
      />,
    );

    fireEvent.press(screen.getByText("Dog"));
    expect(onSelectType).toHaveBeenCalledWith("Dog");
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = jest.fn();
    render(
      <PetTypeModal
        visible={true}
        onClose={onClose}
        onSelectType={jest.fn()}
        petTypes={Object.values(PET_TYPES)}
      />,
    );

    fireEvent.press(screen.getByTestId("overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders all pet types correctly", () => {
    render(
      <PetTypeModal
        visible={true}
        onClose={jest.fn()}
        onSelectType={jest.fn()}
        petTypes={Object.values(PET_TYPES)}
      />,
    );

    Object.values(PET_TYPES).forEach(type => {
      expect(screen.getByText(type)).toBeTruthy();
    });
  });
});
