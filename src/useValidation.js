import React from "react";

import { emptyObj, noop, validateField } from "./util";

export default function useValidation(form, validate = noop) {
  const [formErrors, setErrors] = React.useState(emptyObj);
  const [validating, setValidating] = React.useState(false);

  // TODO: functionality for cancelling validation.
  const validateForm = React.useCallback(async () => {
    if (validate === noop) return true;
    setValidating(true);
    const { values, inputs } = form.current;
    const errors = await handleValidate(validate)(values, inputs);
    const valid = !errors || !Object.values(errors).some(Boolean);
    setErrors(valid ? emptyObj : errors);
    setValidating(false);
    return valid;
  }, [form, validate]);

  return [validateForm, formErrors, validating];
}

function handleValidate(validate) {
  return typeof validate === "function"
    ? validate
    : (values, inputs) =>
        Object.fromEntries(
          Object.entries(validate).map(([n, f]) =>
            validateField(f)(values[n], inputs)
          )
        );
}
