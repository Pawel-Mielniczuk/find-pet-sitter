import React from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
}: UseFormOptions<T>) {
  const [inputs, setInputs] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setInputs(prev => ({ ...prev, [name]: value }));

    if (validate) {
      const newErrors = validate({ ...inputs, [name]: value });

      setErrors(prevErrors => {
        const updatedErrors: Partial<Record<keyof T, string>> = Object.keys(prevErrors)
          .filter(key => key !== name || newErrors[name])
          .reduce((acc, key) => ({ ...acc, [key]: prevErrors[key as keyof T] }), {});

        if (newErrors[name]) {
          updatedErrors[name] = newErrors[name];
        }

        return updatedErrors;
      });
    }
  };

  const validateForm = () => {
    if (!validate) return true;

    const validationErrors = validate(inputs);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    inputs,
    errors,
    handleChange,
    validateForm,
    setInputs,
  };
}
