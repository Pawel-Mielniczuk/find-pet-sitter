import { ERROR_MESSAGES } from "../errorMessages";
import { initialValues, LoginFormValues, validateLoginForm } from "../loginForm";

describe("validateLoginForm", () => {
  it("should return no errors for a valid login form", () => {
    const validLoginData: LoginFormValues = {
      email: "user@example.com",
      password: "validPassword123",
    };

    const errors = validateLoginForm(validLoginData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("should return required error for empty email", () => {
    const invalidLoginData: LoginFormValues = {
      ...initialValues,
      password: "validPassword123",
    };

    const errors = validateLoginForm(invalidLoginData);
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
      const invalidLoginData: LoginFormValues = {
        email,
        password: "validPassword123",
      };

      const errors = validateLoginForm(invalidLoginData);
      expect(errors.email).toBe(ERROR_MESSAGES.INVALID_EMAIL);
    });
  });

  it("should return required error for empty password", () => {
    const invalidLoginData: LoginFormValues = {
      ...initialValues,
      email: "user@example.com",
    };

    const errors = validateLoginForm(invalidLoginData);
    expect(errors.password).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should accept valid email formats", () => {
    const testCases = [
      "user@example.com",
      "user.name@example.co.uk",
      "user+tag@example.org",
      "user-name@example.net",
    ];

    testCases.forEach(email => {
      const validLoginData: LoginFormValues = {
        email,
        password: "validPassword123",
      };

      const errors = validateLoginForm(validLoginData);
      expect(errors.email).toBeUndefined();
    });
  });

  it("should return errors for all fields when form is completely empty", () => {
    const errors = validateLoginForm(initialValues);

    expect(errors.email).toBe(ERROR_MESSAGES.REQUIRED);
    expect(errors.password).toBe(ERROR_MESSAGES.REQUIRED);
  });

  it("should return an object with error keys", () => {
    const incompleteLoginData: LoginFormValues = {
      ...initialValues,
      email: "user@example.com",
    };

    const errors = validateLoginForm(incompleteLoginData);

    expect(typeof errors).toBe("object");
    expect(errors).toHaveProperty("password");
  });
});
