import { ERROR_MESSAGES } from "./errorMessages";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const initialValues = {
  email: "",
  password: "",
};
export function validateLoginForm(values: LoginFormValues) {
  const newErrors: Partial<LoginFormValues> = {};

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

  return newErrors;
}
