import React from "react";

import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";
import { mapObject, flattenInputs, get } from "./util";

export default function useForm({
  handleSubmit,
  initialValues = {},
  inputs,
  postSubmit,
  preSubmit,
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
    flattenInputs(inputs).forEach(([name, input]) => {
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
    postSubmit,
    preSubmit,
    validateForm,
  });

  const errors = React.useMemo(
    () =>
      mapObject(
        inputs,
        (i, k) =>
          i.meta.inputError || get(formErrors, k) || get(submitErrors, k)
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
