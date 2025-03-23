// import { render, screen } from "@testing-library/react-native";

// import { Pet } from "../../lib/types";
// import { PetsList } from "./pets-list";

// const pets: Pet[] = [
//   {
//     id: "1",
//     name: "Rex",
//     breed: "Labrador",
//     type: "Dog",
//     age: "5",
//     image: "https://example.com/rex.jpg",
//     weight: "30",
//     special_instructions: "Needs medication",
//     custom_type: "",
//     owner_id: "123",
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "2",
//     name: "Fluffy",
//     breed: "Persian",
//     type: "Cat",
//     age: "3",
//     image: "https://example.com/fluffy.jpg",
//     weight: undefined,
//     special_instructions: "",
//     custom_type: "",
//     owner_id: "1234",
//     created_at: new Date().toISOString(),
//   },
// ];

// describe("PetsList", () => {
//   it("renders pet names correctly", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-name-1")).toHaveTextContent("Rex");
//     expect(screen.getByTestId("pet-name-2")).toHaveTextContent("Fluffy");
//   });

//   it("renders pet breed correctly", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-breed-1")).toHaveTextContent("Labrador");
//     expect(screen.getByTestId("pet-breed-2")).toHaveTextContent("Persian");
//   });

//   it("renders pet age correctly", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-age-1")).toHaveTextContent("5");
//     expect(screen.getByTestId("pet-age-2")).toHaveTextContent("3");
//   });

//   it("renders pet weight if available", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-weight-1")).toHaveTextContent("Weight: 30");
//     expect(screen.queryByTestId("pet-weight-2")).toBeNull();
//   });

//   it("renders special instructions if available", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-special-instructions-1")).toHaveTextContent(
//       "Note: Needs medication",
//     );
//     expect(screen.queryByTestId("pet-special-instructions-2")).toBeNull();
//   });

//   it("renders pet type correctly", () => {
//     render(<PetsList pets={pets} />);
//     expect(screen.getByTestId("pet-type-1")).toHaveTextContent("Dog");
//     expect(screen.getByTestId("pet-type-2")).toHaveTextContent("Cat");
//   });
// });
