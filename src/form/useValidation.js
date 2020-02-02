import { useCallback, useEffect } from "react";

import { debounce } from "./util";

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

  const validateForm = useCallback(
    debounce(async () => {
      const valueEntries = Object.entries(inputs).map(([k, v]) => [k, v.value]);
      const values = Object.fromEntries(valueEntries);
      setErrors(await validate(values));
    }, 100),
    [inputs, setErrors, validate]
  );

  useEffect(() => {
    validateForm();
  }, [validateForm]);
}
