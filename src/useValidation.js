import React from "react";

import useChanged from "./useChanged";
import useSetErrors from "./useSetErrors";
import { mapObject, noop } from "./util";

export default function useValidation({ inputs, validate = noop }) {
  const setErrors = useSetErrors(inputs);

  const validateForm = React.useCallback(async () => {
    const values = mapObject(inputs, (i) => i.meta.actualValue);
    setErrors(await validate(values));
  }, [inputs, setErrors, validate]);

  const changedInputs = useChanged(inputs);

  React.useEffect(() => {
    const t = setTimeout(validateForm, 200);
    return () => {
      clearTimeout(t);
    };
  }, [changedInputs, validateForm]);
}
