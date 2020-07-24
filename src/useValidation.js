import React from "react";

import { emptyObj, handleValidate, mapObject, noop } from "./util";

export default function useValidation(inputs, validate = noop) {
  const [errors, setErrors] = React.useState(emptyObj);

  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    const errors = await handleValidate(validate)(values, inputs);
    setErrors(errors || emptyObj);
    return errors;
  }, [inputs, validate]);

  return [errors, validateForm];
}
