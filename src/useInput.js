import React from "react";

window.React = React;

import { noop, id, getEventValue, validateField, useUpdate } from "./util";

export default function useInput({
  delay = 200,
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
  const form = React.useRef();
  const input = React.useRef({}).current;
  const ref = React.useRef();
  const meta = useMeta();

  const t = React.useRef();
  const setChanged = React.useCallback(() => {
    if (!meta.form.current) return;
    clearTimeout(t.current);
    t.current = setTimeout(() => {
      meta.changed = true;
      meta.form.current.update();
    }, delay);
  }, [delay, meta]);

  const setValue = React.useCallback(
    (value, changed) => {
      setActualValue((prevValue) =>
        parse(typeof value === "function" ? value(prevValue) : value, prevValue)
      );
      if (changed) setChanged();
    },
    [parse, setChanged]
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
      setValue(eventValue, true);
    },
    [handleChange, setValue]
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

  React.useEffect(() => () => clearTimeout(t.current), [meta]);

  React.useDebugValue(actualValue);

  const dirty = actualValue !== initialValue;
  Object.assign(meta, {
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
  });
  return Object.assign(input, {
    meta,
    onBlur,
    onChange,
    onFocus,
    ref,
    value: active ? actualValue : format(actualValue),
  });
}

const validate = Symbol();
const errorMap = Symbol();
const dummyForm = { formErrors: {} };

const useMeta = () => {
  const update = useUpdate();
  return React.useRef({
    [errorMap]: new Map(),
    get error() {
      const form = this.form.current || dummyForm;
      return (
        (!this.validating && this.inputError) ||
        (!form.formValidating ? form.formErrors : form.submitErrors)[this.name]
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
};
