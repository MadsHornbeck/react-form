import React from "react";

import { noop, id, getEventValue, validateField } from "./util";

// TODO: find out how to reset inputChanged if form unmount but input doesn't
const defaultForm = { formErrors: {}, submitErrors: {}, inputChanged: noop };

export default function useInput({
  delay = 200,
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleFocus = noop,
  initialValue = "",
  normalize = id,
  parse = id,
  validate: validateFn = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = React.useState(initialValue);
  const [inputError, setError] = React.useState(undefined);
  const [touched, setTouched] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [validating, setValidating] = React.useState(false);
  const form = React.useRef(defaultForm);
  const input = React.useRef({});
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
      form.current.inputChanged(input.current.name);
    },
    [handleChange, setValue]
  );

  const onBlur = React.useCallback(
    (e) => {
      handleBlur(e);
      setActive(false);
      setTouched(true);
      setActualValue(normalize);
      // TODO: maybe add a validateOnBlur prop.
    },
    [handleBlur, normalize]
  );

  const validate = React.useCallback(() => {
    const error = validateField(validateFn)(actualValue);
    if (error instanceof Promise) {
      setValidating(true);
      error.then((err) => {
        setError(err);
        setValidating(false);
      });
    } else {
      setError(error);
    }
    return error;
  }, [actualValue, validateFn]);

  React.useEffect(() => {
    if (!active && !touched) return;
    const t = setTimeout(validate, delay);
    return () => {
      clearTimeout(t);
    };
  }, [active, delay, touched, validate]);

  React.useDebugValue(actualValue);

  const error =
    inputError ||
    form.current.formErrors[input.current.name] ||
    form.current.submitErrors[input.current.name];

  const dirty = actualValue !== initialValue;
  const meta = React.useMemo(
    () => ({
      active,
      actualValue,
      dirty,
      error,
      form,
      inputError,
      invalid: !!error,
      pristine: !dirty,
      setError,
      setTouched,
      setValue,
      touched,
      valid: !error,
      validate,
      validating,
      visited: touched || active,
    }),
    [
      active,
      actualValue,
      dirty,
      error,
      inputError,
      setValue,
      touched,
      validate,
      validating,
    ]
  );

  return Object.assign(input.current, {
    meta,
    onBlur,
    onChange,
    onFocus,
    ref,
    value: active ? actualValue : format(actualValue),
  });
}
