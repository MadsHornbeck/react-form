import React from "react";

import { mapObject, noop, setErrors } from "./util";

export default function useValidation({
  changedInputs,
  inputs,
  validate = noop,
}) {
  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    setErrors(inputs, await validate(values));
  }, [inputs, validate]);

  React.useEffect(() => {
    validateForm();
  }, [changedInputs, validateForm]);
}
