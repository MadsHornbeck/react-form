import React from "react";

import { handleValidate, mapObject, noop, setErrors } from "./util";

export default function useValidation({
  changedInputs,
  inputs,
  validate = noop,
}) {
  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    setErrors(inputs, await handleValidate(validate)(values, inputs));
  }, [inputs, validate]);

  React.useEffect(() => {
    validateForm();
  }, [changedInputs, validateForm]);
}
