import React from "react";

import { noop, id, getEventValue, validateField } from "./util";

export default function useInput({
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleCursor,
  handleFocus = noop,
  initialValue = "", // TODO: maybe add a reset function to reset to initialValue
  normalize = id,
  parse = id,
  validate: validateFn = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = React.useState(initialValue);
  const formattedValue = React.useMemo(() => format(actualValue), [
    format,
    actualValue,
  ]);
  const [inputError, setError] = React.useState(undefined);
  const [touched, setTouched] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [validating, setValidating] = React.useState(false);
  const form = React.useRef({ errors: {} });
  const input = React.useRef({});
  const ref = React.useRef();

  const setValue = React.useCallback(
    (value) => {
      setActualValue((prevValue) =>
        // TODO: maybe format the prevValue passed to parse
        parse(value, prevValue)
      );
    },
    [parse]
  );

  const onFocus = React.useCallback(
    (e) => {
      handleFocus(e); // TODO: do we want any arguments passed here?
      setActive(true);
    },
    [handleFocus]
  );

  const onChange = React.useCallback(
    (e) => {
      // TODO: do we want any arguments passed here?
      handleChange(e);
      const eventValue = getEventValue(e);
      setValue(eventValue);
    },
    [handleChange, setValue]
  );

  const onBlur = React.useCallback(
    (e) => {
      // TODO: do we want any arguments passed here?
      handleBlur(e);
      setActive(false);
      setTouched(true);
      setActualValue(normalize);
      // TODO: maybe add a validateOnBlur prop.
    },
    [handleBlur, normalize]
  );

  // TODO: find a better name for this
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
    // TODO: allow for configuration of validation delay
    const t = setTimeout(validate, 150);
    return () => {
      clearTimeout(t);
    };
  }, [active, touched, validate]);

  React.useEffect(() => {
    if (ref.current && handleCursor) {
      const selection = handleCursor(actualValue, ref.current);
      // TODO: figure out how to handle case where a character in the middle is deleted.
      ref.current.setSelectionRange(selection, selection);
    }
  }, [handleCursor, actualValue]);

  React.useDebugValue(actualValue);

  const error = inputError || form.current.errors[input.current.name];
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

  const formatWhileActive = handleCursor && format !== id && parse !== id;
  return Object.assign(input.current, {
    meta,
    onBlur,
    onChange,
    onFocus,
    ref,
    value: active && !formatWhileActive ? actualValue : formattedValue,
  });
}

export function useMultipleSelect(props) {
  const input = useInput(props);

  const onClick = React.useCallback(
    (e) => {
      if (e.target.tagName === "OPTION" && !e.target.disabled) {
        const handleChange = props.handleChange;
        const setValue = input.meta.setValue;
        handleChange(e);
        setValue(e.target.value);
      }
    },
    [input.meta.setValue, props.handleChange]
  );

  return {
    ...input,
    onClick,
    onChange: noop,
  };
}
