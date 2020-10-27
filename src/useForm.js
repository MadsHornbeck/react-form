import React from "react";

import useSubmit from "./useSubmit";
import { emptyObj, handleValidate, noop, useMap, useUpdate } from "./util";

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

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    setValues(initialValues);
    return () => {
      form.current.unmounted = true;
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

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

const errorMap = Symbol();
const formErrorMap = Symbol();
const values = Symbol();
const changed = Symbol();

function useFormRef() {
  const update = useUpdate();
  return React.useRef({
    [errorMap]: new WeakMap(),
    [formErrorMap]: new WeakMap(),
    get changed() {
      const c = [...this.inputs].filter(([, i]) => i.meta.changed);
      if (c.length) {
        this[changed] = Object.fromEntries(c);
        for (const [, i] of c) i.meta.changed = false;
        this[values] = undefined;
      }
      return this[changed] || emptyObj;
    },
    get values() {
      if (this.changed && !this[values]) {
        this[values] = Object.fromEntries(
          [...this.inputs].map(([n, i]) => [n, i.meta.actualValue])
        );
      }
      return this[values];
    },
    get errors() {
      const { values } = this;
      if (this[errorMap].has(values)) return this[errorMap].get(values);
      const errors = Object.fromEntries(
        [...this.inputs].map(([n, i]) => [n, i.meta.error])
      );
      this[errorMap].set(values, errors);
      return errors;
    },
    get inputErrors() {
      return Object.fromEntries(
        [...this.inputs].map(([n, i]) => [n, i.meta.inputError])
      );
    },
    get formErrors() {
      if (this.validate === noop) return emptyObj;
      const { values } = this;
      if (!this[formErrorMap].has(values)) {
        const errors = handleValidate(this.validate)(values, this.inputs);
        this[formErrorMap].set(values, errors);
        if (errors instanceof Promise) {
          errors.then((e) => {
            if (this.unmounted) return;
            this[formErrorMap].set(values, e);
            update();
          });
        }
      }
      return this[formErrorMap].get(values) || emptyObj;
    },
    get formValidating() {
      return this.formErrors instanceof Promise;
    },
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
