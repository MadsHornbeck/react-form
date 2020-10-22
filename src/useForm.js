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
  const form = useFormRef();

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
    [form, inputs]
  );

  React.useEffect(() => {
    for (const [name, input] of inputs.entries()) {
      input.name = name;
      input.meta.form.current = form.current;
    }
  }, [form, inputs]);

  const [validateForm, formErrors, formValidating] = useValidation(
    form,
    validate
  );

  React.useEffect(() => {
    validateForm();
  }, [changed, validateForm]);

  const [onSubmit, isSubmitting, submitErrors] = useSubmit({
    form,
    handleSubmit,
    validateForm,
  });

  return Object.assign(form.current, {
    addInput,
    changed,
    formValidating,
    formErrors,
    inputChanged,
    inputs,
    isSubmitting,
    onSubmit,
    setInputs,
    setValues,
    submitErrors,
    validate: validateForm,
  });
}

const errorMap = Symbol();

function useFormRef() {
  return React.useRef({
    [errorMap]: new WeakMap(),
    get values() {
      return Object.fromEntries(
        [...this.inputs].map(([n, i]) => [n, i.meta.actualValue])
      );
    },
    get errors() {
      if (this[errorMap].has(this.changed))
        return this[errorMap].get(this.changed);
      const errors = Object.fromEntries(
        [...this.inputs.entries()].map(([n, i]) => [n, i.meta.error])
      );
      this[errorMap].set(this.changed, errors);
      return errors;
    },
    get inputErrors() {
      return Object.fromEntries(
        [...this.inputs].map(([n, i]) => [n, i.meta.inputError])
      );
    },
    // TODO: add formErrors here somehow.
    get validating() {
      return (
        this.formValidating ||
        [...this.inputs.values()].some((i) => i.meta.validating)
      );
    },
    get valid() {
      return (
        this.formErrors === emptyObj &&
        [...this.inputs.values()].every((i) => i.meta.valid)
      );
    },
    get invalid() {
      return !this.valid;
    },
    get canSubmit() {
      return !this.isSubmitting && this.valid;
    },
  });
}
