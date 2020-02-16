import { useCallback, useEffect } from "react";

import { useChanged } from "./useChangeHandler";
import { mapObject } from "./util";

export function useSetErrors(inputs) {
  return useCallback(
    (errors = {}) => {
      const errorEntries = Object.entries(errors).filter(([k]) => inputs[k]);
      errorEntries.forEach(([k, e]) => {
        inputs[k].meta.setError(e);
      });
      return !!errorEntries.length;
    },
    [inputs]
  );
}

export default function useValidation({ inputs, validate }) {
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
