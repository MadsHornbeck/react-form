import React from "react";

import useSetErrors from "./useSetErrors";
import { mapObject, noop } from "./util";

export default function useValidation({
  changedInputs,
  inputs,
  validate = noop,
}) {
  const setErrors = useSetErrors(inputs);

  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    setErrors(await validate(values));
  }, [inputs, setErrors, validate]);

  React.useEffect(() => {
    validateForm();
  }, [changedInputs, validateForm]);
}
