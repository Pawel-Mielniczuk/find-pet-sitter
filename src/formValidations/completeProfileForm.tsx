import { ERROR_MESSAGES } from "./errorMessages";

type CompleteProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  userType: string;
};

export const initialValues = {
  firstName: "",
  lastName: "",
  phone: "",
  location: "",
  userType: "",
};

export function validateCompleteProfileForm(values: CompleteProfileFormValues) {
  const newErrors: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    userType?: string;
  } = {};

  if (!values.firstName) {
    newErrors.firstName = ERROR_MESSAGES.REQUIRED;
  }

  if (!values.lastName) {
    newErrors.lastName = ERROR_MESSAGES.REQUIRED;
  }

  if (!values.phone) {
    newErrors.phone = ERROR_MESSAGES.REQUIRED;
  }

  if (!values.location) {
    newErrors.location = ERROR_MESSAGES.REQUIRED;
  }

  if (!values.userType) {
    newErrors.userType = ERROR_MESSAGES.ROLE_REQUIRED;
  }

  return newErrors;
}
