// import { NewPet, PET_TYPES, PetFormData } from "../../lib/types";
// import { ERROR_MESSAGES } from "../errorMessages";
// import { validatePetData } from "../validatePetData";

// describe("validatePetData", () => {
//   it("should return an empty object for valid data", () => {
//     const validPet: NewPet = {
//       name: "Buddy",
//       type: PET_TYPES.Dog,
//       breed: "German Shepherd",
//       age: "3",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(validPet);
//     expect(errors).toEqual({});
//   });

//   it("should return an error for empty name", () => {
//     const invalidPet: NewPet = {
//       name: "",
//       type: PET_TYPES.Dog,
//       breed: "German Shepherd",
//       age: "3",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.name).toBe(ERROR_MESSAGES.PET_NAME_REQUIRED);
//   });

//   it("should return an error for name with only whitespace", () => {
//     const invalidPet: NewPet = {
//       name: "   ",
//       type: PET_TYPES.Dog,
//       breed: "German Shepherd",
//       age: "3",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.name).toBe(ERROR_MESSAGES.PET_NAME_REQUIRED);
//   });

//   it("should return an error for missing pet type", () => {
//     const invalidPet: NewPet = {
//       name: "Buddy",
//       type: "",
//       breed: "German Shepherd",
//       age: "3",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.type).toBe(ERROR_MESSAGES.PET_TYPE_REQUIRED);
//   });

//   it('should return an error for "Other" type without custom type specified', () => {
//     const invalidPet: NewPet = {
//       name: "Buddy",
//       type: PET_TYPES.Other,
//       breed: "Mixed",
//       age: "3",
//       image: "https://example.com/pet.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.custom_type).toBe(ERROR_MESSAGES.SPECIFY_PET_TYPE);
//   });

//   it('should accept "Other" type with custom type specified', () => {
//     const validPet: NewPet = {
//       name: "Buddy",
//       type: PET_TYPES.Other,
//       breed: "Mixed",
//       age: "3",
//       image: "https://example.com/pet.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "Ferret",
//     };

//     const errors = validatePetData(validPet);
//     expect(errors.custom_type).toBeUndefined();
//   });

//   it("should return an error for empty breed", () => {
//     const invalidPet: NewPet = {
//       name: "Buddy",
//       type: PET_TYPES.Dog,
//       breed: "",
//       age: "3",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.breed).toBe(ERROR_MESSAGES.BREED_REQUIRED);
//   });

//   it("should return an error for empty age", () => {
//     const invalidPet: NewPet = {
//       name: "Buddy",
//       type: PET_TYPES.Dog,
//       breed: "German Shepherd",
//       age: "",
//       image: "https://example.com/dog.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.age).toBe(ERROR_MESSAGES.AGE_REQUIRED);
//   });

//   it("should return multiple errors for multiple invalid fields", () => {
//     const invalidPet: NewPet = {
//       name: "",
//       type: "",
//       breed: "",
//       age: "",
//       image: "https://example.com/pet.jpg",
//       weight: null,
//       special_instructions: "",
//       custom_type: "",
//     };

//     const errors = validatePetData(invalidPet);
//     expect(errors.name).toBe(ERROR_MESSAGES.PET_NAME_REQUIRED);
//     expect(errors.type).toBe(ERROR_MESSAGES.PET_TYPE_REQUIRED);
//     expect(errors.breed).toBe(ERROR_MESSAGES.BREED_REQUIRED);
//     expect(errors.age).toBe(ERROR_MESSAGES.AGE_REQUIRED);
//   });

//   it("should validate PetFormData type correctly", () => {
//     const formData: PetFormData = {
//       name: "",
//       type: PET_TYPES.Cat,
//       breed: "Siamese",
//       age: "2",
//       image: "https://example.com/cat.jpg",
//       weight: "4.5",
//       special_instructions: "Needs medication twice daily",
//       custom_type: "",
//     };

//     const errors = validatePetData(formData);
//     expect(errors.name).toBe(ERROR_MESSAGES.PET_NAME_REQUIRED);
//     expect(errors.type).toBeUndefined();
//     expect(errors.breed).toBeUndefined();
//     expect(errors.age).toBeUndefined();
//   });
// });
