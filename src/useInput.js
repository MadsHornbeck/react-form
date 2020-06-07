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
  const input = useRef({});
  // TODO: Try to find a better name than: `actualValue`.
  const [actualValue, setActualValue] = useState(initialValue);
  const formattedValue = useMemo(() => format(actualValue), [
    format,
    actualValue,
  ]);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(undefined);
  const [active, setActive] = useState(false);

  // TODO: consider using ref instead.
  const [target, setTarget] = useState(null);

  const onFocus = useCallback(
    (e) => {
      handleFocus(e); // TODO: do we want any arguments passed here?
      setTarget(e.currentTarget);
      setTouched(true);
      setActive(true);
    },
    [handleFocus]
  );

  const setValue = useCallback(
    (value) => {
      setActualValue((prevValue) => parse(value, prevValue));
    },
    [parse]
  );

  const onChange = useCallback(
    (e) => {
      handleChange(e); // TODO: do we want any arguments passed here?
      setTarget(e.currentTarget);
      const eventValue = getEventValue(e);
      setValue(eventValue);
    },
    [handleChange, setValue]
  );

  // TODO: test this, should move cursor properly in formatted field
  useEffect(() => {
    if (target && handleCursor) {
      console.log(target);
      // TODO: find a name for this
      const selection = handleCursor(actualValue, formattedValue);
      target.setSelectionRange(selection, selection);
    }
  }, [active, handleCursor, target, actualValue, formattedValue]);

  const onBlur = useCallback(
    (e) => {
      handleBlur(e); // TODO: do we want any arguments passed here?
      setActive(false);
    },
    [handleBlur]
  );

  const validation = useCallback(
    async (value) => {
      setError(await validate(value));
    },
    [validate]
  );

  useEffect(() => {
    // TODO: allow for configuration of delay
    const t = setTimeout(() => validation(actualValue), 150);
    return () => {
      clearTimeout(t);
    };
  }, [actualValue, validation]);

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
    // value: active ? value : format(value),
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
