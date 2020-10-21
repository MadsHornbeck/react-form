import React from "react";

import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";
import { emptyObj, useMap } from "./util";

export default function useForm({
  handleSubmit,
  initialValues = {},
  inputs: is = {},
  validate,
  delay = 200,
}) {
  const [inputs, setInputs] = useMap(is);
  const [changed, inputChanged] = useChanged(delay);
  const form = React.useRef({});

  const setValues = React.useCallback(
    (values) => {
      Object.entries(values)
        .filter(([name]) => inputs.has(name))
        .forEach(([name, value]) => inputs.get(name).meta.setValue(value));
    },
    [inputs]
  );

  React.useEffect(() => {
    setValues(initialValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addInput = React.useCallback(
    (name, input) => {
      inputs.set(name, input);
      input.name = name;
      input.meta.form.current = form.current;
    },
    [inputs]
  );

  React.useEffect(() => {
    for (const [name, input] of inputs.entries()) {
      input.name = name;
      input.meta.form.current = form.current;
    }
  }, [inputs]);

  const [validateForm, formErrors, formValidating] = useValidation(
    inputs,
    validate
  );

  React.useEffect(() => {
    if (changed !== emptyObj) validateForm();
  }, [changed, validateForm]);

  const [onSubmit, isSubmitting, submitErrors] = useSubmit({
    handleSubmit,
    inputs,
    validateForm,
  });

  const inputArr = [...inputs.entries()];
  const valid =
    formErrors === emptyObj && inputArr.every(([, i]) => i.meta.valid);

  const validating =
    formValidating || inputArr.some(([, i]) => i.meta.validating);

  const errors = Object.fromEntries(
    inputArr.map(([n, i]) => [
      n,
      i.meta.inputError || formErrors[n] || submitErrors[n],
    ])
  );

  return Object.assign(form.current, {
    addInput,
    canSubmit: !isSubmitting && valid,
    changed,
    errors,
    formErrors,
    inputChanged,
    inputs,
    invalid: !valid,
    isSubmitting,
    onSubmit,
    setInputs,
    setValues,
    submitErrors,
    valid,
    validate: validateForm,
    validating,
  });
}
