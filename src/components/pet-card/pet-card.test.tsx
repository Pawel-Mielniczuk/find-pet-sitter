// import { render, screen } from "@testing-library/react-native";
// import React from "react";

// import { Pet } from "../../lib/types";
// import { PetCard } from "./pet-card";

// jest.mock("expo-image", () => {
//   const { View, Text } = require("react-native");

//   return {
//     Image: ({ source }: { source: { uri: string } }) => (
//       <View testID="image">
//         <Text>{source.uri}</Text>
//       </View>
//     ),
//   };
// });

// jest.mock("lucide-react-native", () => {
//   const { Text } = require("react-native");
//   return {
//     Calendar: () => <Text>Calendar Icon</Text>,
//     FileText: () => <Text>FileText Icon</Text>,
//     PawPrint: () => <Text>PawPrint Icon</Text>,
//     Weight: () => <Text>Weight Icon</Text>,
//   };
// });

// describe("PetCard", () => {
//   const mockPet: Pet = {
//     id: "1",
//     name: "Buddy",
//     type: "Dog",
//     custom_type: "",
//     breed: "Golden Retriever",
//     age: "3 years",
//     weight: "25",
//     image: "https://example.com/dog.jpg",
//     special_instructions: "Needs daily medication at 9am",
//     created_at: "2023-01-01T12:00:00Z",
//     owner_id: "owner1",
//   };

//   it("displays basic pet information", () => {
//     render(<PetCard pet={mockPet} />);

//     expect(screen.getByText("Buddy")).toBeTruthy();
//     expect(screen.getByText("Dog")).toBeTruthy();
//     expect(screen.getByText("Golden Retriever")).toBeTruthy();
//     expect(screen.getByText("3 years")).toBeTruthy();
//     expect(screen.getByText("25 kg")).toBeTruthy();
//   });

//   it("displays custom type if available", () => {
//     const petWithCustomType: Pet = { ...mockPet, custom_type: "Puppy" };

//     render(<PetCard pet={petWithCustomType} />);

//     expect(screen.getByText("Puppy")).toBeTruthy();
//     expect(screen.queryByText("Dog")).toBeFalsy();
//   });

//   it("displays special instructions if available", () => {
//     render(<PetCard pet={mockPet} />);

//     expect(screen.getByText("Special Instructions")).toBeTruthy();
//     expect(screen.getByText("Needs daily medication at 9am")).toBeTruthy();
//   });

//   it("does not display special instructions section if not available", () => {
//     const petWithoutInstructions: Pet = { ...mockPet, special_instructions: "" };

//     render(<PetCard pet={petWithoutInstructions} />);

//     expect(screen.queryByText("Special Instructions")).toBeFalsy();
//   });

//   it("does not display weight section if weight is not provided", () => {
//     const petWithoutWeight: Pet = { ...mockPet, weight: "" };

//     render(<PetCard pet={petWithoutWeight} />);

//     expect(screen.queryByText("Weight")).toBeFalsy();
//     expect(screen.queryByText("kg")).toBeFalsy();
//   });
// });
