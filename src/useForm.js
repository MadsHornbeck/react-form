import React from "react";

import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";
import { mapObject } from "./util";

export default function useForm({
  handleSubmit,
  initialValues = {},
  inputs,
  validate,
}) {
  const changed = useChanged(inputs);
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

  const [formErrors, validateForm] = useValidation(inputs, validate);

  React.useEffect(() => {
    validateForm();
  }, [changed, validateForm]);

  const [onSubmit, isSubmitting, submitErrors] = useSubmit({
    handleSubmit,
    inputs,
    validateForm,
  });

  const errors = React.useMemo(
    () =>
      mapObject(
        inputs,
        (i, n) => i.meta.inputError || formErrors[n] || submitErrors[n]
      ),
    [changed, formErrors, inputs, submitErrors] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return Object.assign(form.current, {
    changed,
    errors,
    formErrors,
    inputs,
    isSubmitting,
    onSubmit,
    setValues,
    submitErrors,
    validate: validateForm,
  });
}
