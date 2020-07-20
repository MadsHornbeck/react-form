import React from "react";

import { handleValidate, mapObject, noop } from "./util";

const noErrors = Object.freeze({});

export default function useValidation(inputs, validate = noop) {
  const [errors, setErrors] = React.useState(noErrors);

  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    const errors = await handleValidate(validate)(values, inputs);
    setErrors(errors || noErrors);
    return errors;
  }, [inputs, validate]);

  return [errors, validateForm];
}
