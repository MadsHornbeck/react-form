import { useCallback, useEffect } from "react";

import { useChanged } from "./useChangeHandler";
import { mapObject, noop } from "./util";

export function useSetErrors(inputs) {
  return useCallback(
    (errors = {}) => {
      for (const name in errors) {
        if (!inputs[name]) continue;
        inputs[name].meta.setError(errors[name]);
      }
    },
    [inputs]
  );
}

export default function useValidation({ inputs, validate = noop }) {
  const setErrors = useSetErrors(inputs);

  const validateForm = useCallback(async () => {
    const values = mapObject(inputs, "value");
    setErrors(await validate(values));
  }, [inputs, setErrors, validate]);

  const changedInputs = useChanged(inputs);

  useEffect(() => {
    if (!changedInputs.length) return;
    const t = setTimeout(validateForm, 200);
    return () => {
      clearTimeout(t);
    };
  }, [changedInputs.length, validateForm]);
}
