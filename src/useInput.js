import {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import { noop, id, getEventValue } from "./util";

export default function useInput({
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleCursor,
  handleFocus = noop,
  initialValue = "",
  parse = id,
  validate = noop,
} = {}) {
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = useState(initialValue);
  const formattedValue = useMemo(() => format(actualValue), [
    format,
    actualValue,
  ]);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(undefined);
  const [active, setActive] = useState(false);
  const input = useRef({});
  const ref = useRef();

  const setValue = useCallback(
    (value) => {
      setActualValue((prevValue) => parse(value, prevValue));
    },
    [parse]
  );

  const onFocus = useCallback(
    (e) => {
      handleFocus(e); // TODO: do we want any arguments passed here?
      setTouched(true);
      setActive(true);
    },
    [handleFocus]
  );

  const onChange = useCallback(
    (e) => {
      // TODO: do we want any arguments passed here?
      handleChange(e);
      const eventValue = getEventValue(e);
      setValue(eventValue);
    },
    [handleChange, setValue]
  );

  const onBlur = useCallback(
    (e) => {
      // TODO: do we want any arguments passed here?
      handleBlur(e);
      setActive(false);
    },
    [handleBlur]
  );

  useEffect(() => {
    const t = setTimeout(async () => {
      setError(await validate(actualValue));
      // TODO: allow for configuration of validation delay
    }, 150);
    return () => {
      clearTimeout(t);
    };
  }, [actualValue, validate, setError]);

  useEffect(() => {
    if (ref.current && handleCursor) {
      const selection = handleCursor(actualValue, ref.current);
      // TODO: figure out how to handle case where a character in the middle is deleted.
      ref.current.setSelectionRange(selection, selection);
    }
  }, [handleCursor, actualValue]);

  useDebugValue(actualValue);

  const meta = useMemo(
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

  const showFormattedValue = handleCursor && parse !== id;
  return Object.assign(input.current, {
    meta,
    onBlur,
    onChange,
    onFocus,
    ref,
    value: active && !showFormattedValue ? actualValue : formattedValue,
  });
}

export function useMultipleSelect(a) {
  const f = useInput(a);

  const onClick = useCallback(
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
