import React from "react";

import { noop, id, getEventValue, validateField, useUpdate } from "./util";

// TODO: find out how to reset inputChanged if form unmount but input doesn't
const defaultForm = { formErrors: {}, submitErrors: {}, inputChanged: noop };

export default function useInput({
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleFocus = noop,
  initialValue = "",
  normalize = id,
  parse = id,
  validate = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = React.useState(initialValue);
  const [touched, setTouched] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const form = React.useRef(defaultForm);
  const input = React.useRef({}).current;
  const ref = React.useRef();

  const setValue = React.useCallback(
    (value) => {
      setActualValue((prevValue) =>
        parse(typeof value === "function" ? value(prevValue) : value, prevValue)
      );
    },
    [parse]
  );

  const onFocus = React.useCallback(
    (e) => {
      handleFocus(e);
      setActive(true);
    },
    [handleFocus]
  );

  const onChange = React.useCallback(
    (e) => {
      handleChange(e);
      const eventValue = getEventValue(e);
      setValue(eventValue);
      form.current.inputChanged(input.name, true);
    },
    [handleChange, input.name, setValue]
  );

  const onBlur = React.useCallback(
    (e) => {
      handleBlur(e);
      setActive(false);
      setTouched(true);
      setActualValue(normalize);
    },
    [handleBlur, normalize]
  );

  React.useDebugValue(actualValue);

  const dirty = actualValue !== initialValue;

  const meta = useMeta();

  return Object.assign(input, {
    meta: Object.assign(meta, {
      active,
      actualValue,
      dirty,
      form,
      pristine: !dirty,
      setTouched,
      setValue,
      touched,
      validate,
      visited: touched || active,
      name: input.name,
    }),
    onBlur,
    onChange,
    onFocus,
    ref,
    value: active ? actualValue : format(actualValue),
  });
}

const fn = Symbol();
const errorMap = Symbol();
const useMeta = () => {
  const update = useUpdate();
  return React.useRef({
    [errorMap]: new Map(),
    get error() {
      return (
        (this.inputError instanceof Promise ? undefined : this.inputError) ||
        this.form.current.formErrors[this.name] ||
        this.form.current.submitErrors[this.name]
      );
    },
    get inputError() {
      const value = this.actualValue;
      if (this[errorMap].has(value)) return this[errorMap].get(value);
      const error = validateField(this[fn])(value);
      if (
        error instanceof Promise &&
        !(this[errorMap].get(value) instanceof Promise)
      ) {
        error.then((e) => {
          this[errorMap].set(value, e);
          this.form.current.inputChanged(this.name, false);
          update();
        });
      }
      this[errorMap].set(value, error);
      return error;
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
      // TODO: find better names here
      if (this[fn] !== f) this[errorMap].clear();
      this[fn] = f;
    },
  }).current;
};
