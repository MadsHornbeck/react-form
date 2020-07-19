import React from "react";

import { handleValidate, mapObject, noop } from "./util";

export default function useValidation({
  changedInputs,
  inputs,
  validate = noop,
}) {
  const [errors, setErrors] = React.useState({});

  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    const errors = await handleValidate(validate)(values, inputs);
    setErrors(errors);
    return !Object.values(errors).some(Boolean);
  }, [inputs, validate]);

  React.useEffect(() => {
    validateForm();
  }, [changedInputs, validateForm]);

  return [errors, validateForm];
}
