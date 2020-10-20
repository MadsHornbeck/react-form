import React from "react";

import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";
import { emptyObj, mapObject } from "./util";

export default function useForm({
  handleSubmit,
  initialValues = {},
  inputs: is = {},
  validate,
  delay = 200,
}) {
  const [inputs, setInputs] = React.useState(is);
  const [changed, inputChanged] = useChanged(delay);
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

  const [validateForm, formErrors, formValidating] = useValidation(
    inputs,
    validate
  );

  React.useEffect(() => {
    validateForm();
  }, [changed, validateForm]);

  const [onSubmit, isSubmitting, submitErrors] = useSubmit({
    handleSubmit,
    inputs,
    validateForm,
  });

  const valid =
    formErrors === emptyObj && Object.values(inputs).every((i) => i.meta.valid);

  const validating =
    formValidating || Object.values(inputs).some((i) => i.meta.validating);

  const errors = React.useMemo(
    () =>
      mapObject(
        inputs,
        (i, n) => i.meta.inputError || formErrors[n] || submitErrors[n]
      ),
    [changed, formErrors, inputs, submitErrors] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return Object.assign(form.current, {
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
