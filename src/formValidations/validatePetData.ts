import { NewPet, PetFormData, ValidationErrors } from "../lib/types";
import { ERROR_MESSAGES } from "./errorMessages";

export function validatePetData(data: NewPet | PetFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = ERROR_MESSAGES.PET_NAME_REQUIRED;
  }

  if (!data.type) {
    errors.type = ERROR_MESSAGES.PET_TYPE_REQUIRED;
  }

  if (data.type === "Other" && !data.custom_type?.trim()) {
    errors.custom_type = ERROR_MESSAGES.SPECIFY_PET_TYPE;
  }

  if (!data.breed.trim()) {
    errors.breed = ERROR_MESSAGES.BREED_REQUIRED;
  }

  if (!data.age.trim()) {
    errors.age = ERROR_MESSAGES.AGE_REQUIRED;
  }

  return errors;
}
