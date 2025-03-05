import { initialValues, validateCompleteProfileForm } from "../completeProfileForm";
import { ERROR_MESSAGES } from "../errorMessages";

describe("validateCompleteProfileForm", () => {
  it("should return no errors for a valid complete profile", () => {
    const validProfile = {
      firstName: "Jan",
      lastName: "Nowak",
      phone: "123456789",
      location: "Koszalin",
      userType: "User",
    };

    const errors = validateCompleteProfileForm(validProfile);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("should return error for empty firstName", () => {
    const incompleteProfile = {
      ...initialValues,
      lastName: "Nowak",
      phone: "123456789",
      location: "Koszalin",
      userType: "pet-sitter",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);
    expect(errors.firstName).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return error for empty lastName", () => {
    const incompleteProfile = {
      ...initialValues,
      firstName: "Jan",
      phone: "123456789",
      location: "Koszalin",
      userType: "pet-owner",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);
    expect(errors.lastName).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return error for empty phone", () => {
    const incompleteProfile = {
      ...initialValues,
      firstName: "Jan",
      lastName: "Kowalski",
      location: "Krakow",
      userType: "pet-owner",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);
    expect(errors.phone).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return error for empty location", () => {
    const incompleteProfile = {
      ...initialValues,
      firstName: "Jan",
      lastName: "Kowalski",
      phone: "123456789",
      userType: "pet-owner",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);
    expect(errors.location).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return error for empty userType", () => {
    const incompleteProfile = {
      ...initialValues,
      firstName: "Jan",
      lastName: "Nowak",
      phone: "123456789",
      location: "Gdynia",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);
    expect(errors.userType).toBe(ERROR_MESSAGES.ROLE_REQUIRED);
  });

  it("should return errors for all fields when form is completely empty", () => {
    const errors = validateCompleteProfileForm(initialValues);

    expect(errors.firstName).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.lastName).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.phone).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.location).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.userType).toBe(ERROR_MESSAGES.ROLE_REQUIRED);
  });

  it("should return an object with error keys", () => {
    const incompleteProfile = {
      ...initialValues,
      firstName: "Jan",
    };

    const errors = validateCompleteProfileForm(incompleteProfile);

    expect(typeof errors).toBe("object");
    expect(errors).toHaveProperty("lastName");
    expect(errors).toHaveProperty("phone");
    expect(errors).toHaveProperty("location");
    expect(errors).toHaveProperty("userType");
  });
});
