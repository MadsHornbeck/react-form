import React from "react";

import { emptyObj, handleValidate, mapObject, noop } from "./util";

export default function useValidation(inputs, validate = noop) {
  const [formErrors, setErrors] = React.useState(emptyObj);
  const [validating, setValidating] = React.useState(false);

  // TODO: functionality for cancelling validation.
  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    setValidating(true);
    const errors = await handleValidate(validate)(values, inputs);
    const valid = !errors || !Object.values(errors).some(Boolean);
    setErrors(valid ? emptyObj : errors);
    setValidating(false);
    return valid;
  }, [inputs, validate]);

  return [validateForm, formErrors, validating];
}
