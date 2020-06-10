import React from "react";

import { noop, id, getEventValue } from "./util";

export default function useInput({
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleCursor,
  handleFocus = noop,
  initialValue = "", // TODO: maybe add a reset function to reset to initialValue
  parse = id,
  validate = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = React.useState(initialValue);
  const formattedValue = React.useMemo(() => format(actualValue), [
    format,
    actualValue,
  ]);
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const [active, setActive] = React.useState(false);
  const input = React.useRef({});
  const ref = React.useRef();

  const setValue = React.useCallback(
    (value) => {
      setActualValue((prevValue) => parse(value, prevValue));
    },
    [parse]
  );

  const onFocus = React.useCallback(
    (e) => {
      handleFocus(e); // TODO: do we want any arguments passed here?
      setTouched(true);
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
    },
    [handleBlur]
  );

  React.useEffect(() => {
    const t = setTimeout(async () => {
      setError(await validate(actualValue));
      // TODO: allow for configuration of validation delay
    }, 150);
    return () => {
      clearTimeout(t);
    };
  }, [actualValue, validate, setError]);

  React.useEffect(() => {
    if (ref.current && handleCursor) {
      const selection = handleCursor(actualValue, ref.current);
      // TODO: figure out how to handle case where a character in the middle is deleted.
      ref.current.setSelectionRange(selection, selection);
    }
  }, [handleCursor, actualValue]);

  React.useDebugValue(actualValue);

  const meta = React.useMemo(
    () => ({
      active,
      actualValue,
      error,
      setActive,
      setError,
      setTouched,
      setValue,
      touched,
    }),
    [active, actualValue, error, setValue, touched]
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

export function useMultipleSelect(a) {
  const f = useInput(a);

  const onClick = React.useCallback(
    (e) => {
      if (e.target.tagName === "OPTION" && !e.target.disabled) {
        f.meta.setValue(e.target.value);
      }
    },
    [f.meta]
  );

  return {
    ...f,
    onClick,
    onChange: noop,
  };
}
