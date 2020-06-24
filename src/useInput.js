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
  validate = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = React.useState(initialValue);
  const formattedValue = React.useMemo(() => format(actualValue), [
    format,
    actualValue,
  ]);
  const [error, setError] = React.useState(undefined);
  const [touched, setTouched] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const input = React.useRef({});
  const ref = React.useRef();

  const setValue = React.useCallback(
    (value) => {
      setActualValue((prevValue) =>
        // TODO: maybe format the prevValue passed to parse
        normalize(parse(value, prevValue), prevValue)
      );
    },
    [normalize, parse]
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
    },
    [handleBlur]
  );

  // TODO: find a better name for this
  const _validate = React.useCallback(() => {
    const error = validateField(validate)(actualValue);
    if (error instanceof Promise) {
      error.then((err) => {
        setError(err);
      });
    } else {
      setError(error);
    }
    return error;
  }, [actualValue, validate]);

  React.useEffect(() => {
    if (!active && !touched) return;
    // TODO: allow for configuration of validation delay
    const t = setTimeout(_validate, 150);
    return () => {
      clearTimeout(t);
    };
  }, [active, _validate, touched]);

  React.useEffect(() => {
    if (ref.current && handleCursor) {
      const selection = handleCursor(actualValue, ref.current);
      // TODO: figure out how to handle case where a character in the middle is deleted.
      ref.current.setSelectionRange(selection, selection);
    }
  }, [handleCursor, actualValue]);

  React.useDebugValue(actualValue);

  const dirty = actualValue !== initialValue;
  const meta = React.useMemo(
    () => ({
      active,
      actualValue,
      dirty,
      error,
      invalid: !!error,
      pristine: !dirty,
      setError,
      setTouched,
      setValue,
      touched,
      valid: !error,
      validate: _validate,
      visited: touched || active,
    }),
    [active, actualValue, dirty, error, _validate, setValue, touched]
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
