import React from "react";

import useFormRef from "./useFormRef";
import useSubmit from "./useSubmit";
import { noop, useMap } from "./util";

export default function useForm({
  handleSubmit,
  initialValues = {},
  inputs: is = {},
  validate = noop,
}) {
  const [inputs, setInputs] = useMap(is);
  const form = useFormRef();

  const setValues = React.useCallback(
    (values) => {
      Object.entries(values)
        .filter(([name]) => inputs.has(name))
        .forEach(([name, value]) => {
          inputs.get(name).meta.setValue(value, true);
        });
    },
    [inputs]
  );

  React.useEffect(() => {
    setValues(initialValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: maybe make this not run every render.
  for (const [name, input] of inputs.entries()) {
    if (!input) continue;
    input.name = name;
    input.meta.name = name;
    input.meta.form.current = form.current;
  }

  const [onSubmit, isSubmitting, submitErrors] = useSubmit(form, handleSubmit);

  return Object.assign(form.current, {
    inputs,
    isSubmitting,
    onSubmit,
    setInputs,
    setValues,
    submitErrors,
    validate,
  });
}
