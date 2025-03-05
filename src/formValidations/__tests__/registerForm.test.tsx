import { ERROR_MESSAGES } from "../errorMessages";
import { initialValues, RegisterFormValues, validateRegisterForm } from "../registerForm";

describe("validateRegisterForm", () => {
  it("should return no errors for a valid register form", () => {
    const validRegisterData: RegisterFormValues = {
      email: "user@example.com",
      password: "validPassword123",
      confirmPassword: "validPassword123",
    };

    const errors = validateRegisterForm(validRegisterData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("should return required error for empty email", () => {
    const invalidRegisterData: RegisterFormValues = {
      ...initialValues,
      password: "validPassword123",
      confirmPassword: "validPassword123",
    };

    const errors = validateRegisterForm(invalidRegisterData);
    expect(errors.email).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return invalid email error for incorrectly formatted email", () => {
    const testCases = [
      "invalid-email",
      "invalid@email",
      "invalid.email",
      "@invalid.com",
      "invalid@.com",
    ];

    testCases.forEach(email => {
      const invalidRegisterData: RegisterFormValues = {
        email,
        password: "validPassword123",
        confirmPassword: "validPassword123",
      };

      const errors = validateRegisterForm(invalidRegisterData);
      expect(errors.email).toBe(ERROR_MESSAGES.INVALID_EMAIL);
    });
  });

  it("should return required error for empty password", () => {
    const invalidRegisterData: RegisterFormValues = {
      ...initialValues,
      email: "user@example.com",
      confirmPassword: "validPassword123",
    };

    const errors = validateRegisterForm(invalidRegisterData);
    expect(errors.password).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return confirm password error for empty confirm password", () => {
    const invalidRegisterData: RegisterFormValues = {
      ...initialValues,
      email: "user@example.com",
      password: "validPassword123",
    };

    const errors = validateRegisterForm(invalidRegisterData);
    expect(errors.confirmPassword).toBe(ERROR_MESSAGES.CONFIRM_PASSWORD);
  });

  it("should return password mismatch error when passwords do not match", () => {
    const invalidRegisterData: RegisterFormValues = {
      email: "user@example.com",
      password: "validPassword123",
      confirmPassword: "differentPassword",
    };

    const errors = validateRegisterForm(invalidRegisterData);
    expect(errors.confirmPassword).toBe(ERROR_MESSAGES.PASSWORD_MISMATCH);
  });

  it("should handle whitespace in password confirmation", () => {
    const invalidRegisterData: RegisterFormValues = {
      email: "user@example.com",
      password: "validPassword123",
      confirmPassword: "  validPassword123  ",
    };

    const errors = validateRegisterForm(invalidRegisterData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("should return errors for all fields when form is completely empty", () => {
    const errors = validateRegisterForm(initialValues);

    expect(errors.email).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.password).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.confirmPassword).toBe(ERROR_MESSAGES.CONFIRM_PASSWORD);
  });

  it("should return an object with error keys", () => {
    const incompleteRegisterData: RegisterFormValues = {
      ...initialValues,
      email: "user@example.com",
    };

    const errors = validateRegisterForm(incompleteRegisterData);

    expect(typeof errors).toBe("object");
    expect(errors).toHaveProperty("password");
    expect(errors).toHaveProperty("confirmPassword");
  });
});
