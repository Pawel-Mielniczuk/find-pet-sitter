import { ERROR_MESSAGES } from "./errorMessages";
export const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function validateRegisterForm(values: RegisterFormValues) {
  const newErrors: Partial<typeof initialValues> = {};

  if (!values.email) {
    newErrors.email = ERROR_MESSAGES.REQUIRED;
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  if (!values.password) {
    newErrors.password = ERROR_MESSAGES.REQUIRED;
  } else if (values.password.length < 6) {
    newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }

  if (!values.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD;
  } else if (values.password.trim() !== values.confirmPassword.trim()) {
    newErrors.confirmPassword = ERROR_MESSAGES.PASSWORD_MISMATCH;
  }

  return newErrors;
}
