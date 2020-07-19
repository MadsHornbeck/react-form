import React from "react";

import useChangeHandler from "./useChangeHandler";
import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";
import { mapObject } from "./util";

export default function useForm({
  handleSubmit,
  handlers,
  initialValues = {},
  inputs,
  postSubmit,
  preSubmit,
  validate: validateFn,
}) {
  const changedInputs = useChanged({ inputs });
  const form = React.useRef({});

  const setValues = React.useCallback(
    (values) => {
      Object.entries(values)
        .filter(([name]) => inputs[name])
        .forEach(([name, value]) => inputs[name].meta.setValue(value));
    },
    [inputs]
  );

  React.useEffect(() => {
    setValues(initialValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    Object.entries(inputs).forEach(([name, input]) => {
      input.name = name;
      input.meta.form.current = form.current;
    });
  }, [inputs]);

  useChangeHandler({ changedInputs, inputs, handlers });
  const [formErrors, validate] = useValidation({
    changedInputs,
    inputs,
    validate: validateFn,
  });

  const [onSubmit, isSubmitting, submitErrors] = useSubmit({
    handleSubmit,
    inputs,
    postSubmit,
    preSubmit,
    validate,
  });

  const errors = React.useMemo(
    () =>
      mapObject(
        inputs,
        (i, k) => i.meta.inputError || formErrors[k] || submitErrors[k]
      ),
    [changedInputs, formErrors, inputs, submitErrors] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return Object.assign(form.current, {
    errors,
    formErrors,
    inputs,
    isSubmitting,
    onSubmit,
    setValues,
    submitErrors,
    validate,
  });
}
