import React from "react";
import { emptyObj, noop, toObj, useUpdate } from "./util";

const errorMap = Symbol("Errors");
const formErrorMap = Symbol("FormErrors");
const values = Symbol("Values");
const changed = Symbol("Changed");

export default function useFormRef() {
  const update = useUpdate();
  return React.useRef({
    [errorMap]: new WeakMap(),
    [formErrorMap]: new WeakMap(),
    update,
    get changed() {
      const c = [...this.inputs].filter(([, i]) => i.meta.changed);
      if (c.length) {
        this[changed] = toObj(c);
        for (const [, i] of c) i.meta.changed = false;
        this[values] = undefined;
      }
      return this[changed] || emptyObj;
    },
    get values() {
      if (this.changed && !this[values]) {
        this[values] = toObj(this.inputs.entries(), (i) => i.meta.actualValue);
      }
      return this[values];
    },
    get errors() {
      const { values } = this;
      if (this[errorMap].has(values)) return this[errorMap].get(values);
      const errors = toObj(this.inputs.entries(), (i) => i.meta.error);
      this[errorMap].set(values, errors);
      return errors;
    },
    get inputErrors() {
      return toObj(this.inputs.entries(), (i) => i.meta.inputError);
    },
    get formErrors() {
      if (this.validate === noop) return emptyObj;
      const { values } = this;
      if (!this[formErrorMap].has(values)) {
        const errors = this.validate(values);
        this[formErrorMap].set(values, errors);
        if (errors instanceof Promise) {
          errors.then((e) => {
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
