import React from "react";

import { get, useUpdate, validateField } from "./util";

const validate = Symbol("Validate function");
const errorMap = Symbol("Errors");
const dummyForm = { formErrors: {} };

export default function useMeta() {
  const update = useUpdate();
  return React.useRef({
    [errorMap]: new Map(),
    get error() {
      const form = this.form.current || dummyForm;
      return (
        (!this.validating && this.inputError) ||
        get(
          !form.formValidating ? form.formErrors : form.submitErrors,
          this.name
        )
      );
    },
    get inputError() {
      const value = this.actualValue;
      if (!this[errorMap].has(value)) {
        const error = validateField(this[validate])(value);
        if (error instanceof Promise) {
          error.then((e) => {
            this[errorMap].set(value, e);
            update();
          });
        }
        this[errorMap].set(value, error);
      }
      return this[errorMap].get(value);
    },
    get valid() {
      return !this.error;
    },
    get invalid() {
      return !this.valid;
    },
    get validating() {
      return this.inputError instanceof Promise;
    },
    set validate(f) {
      if (this[validate] !== f) this[errorMap].clear();
      this[validate] = f;
    },
  }).current;
}
