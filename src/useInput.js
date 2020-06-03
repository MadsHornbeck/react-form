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
  handleFocus = noop,
  parse = id,
  validate = noop,
  initialValue = "",
} = {}) {
  const input = useRef({});
  const [value, _setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(undefined);
  const [active, setActive] = useState(false);

  const onFocus = useCallback(
    e => {
      handleFocus(e); // TODO: do we want any arguments passed here?
      setTouched(true);
      setActive(true);
    },
    [handleFocus]
  );

  const setValue = useCallback(
    value => {
      _setValue(prevValue => parse(value, prevValue));
    },
    [parse]
  );

  const onChange = useCallback(
    e => {
      handleChange(e); // TODO: do we want any arguments passed here?
      const eventValue = getEventValue(e);
      setValue(eventValue);
    },
    [handleChange, setValue]
  );

  const onBlur = useCallback(
    e => {
      handleBlur(e); // TODO: do we want any arguments passed here?
      setActive(false);
    },
    [handleBlur]
  );

  const validation = useCallback(
    async value => {
      setError(await validate(value));
    },
    [validate]
  );

  useEffect(() => {
    const t = setTimeout(() => validation(value), 150);
    // TODO: allow for configuration of delay
    return () => {
      clearTimeout(t);
    };
  }, [validation, value]);

  useDebugValue(value);

  const meta = useMemo(
    () => ({
      active,
      error,
      setActive,
      setError,
      setTouched,
      setValue,
      touched,
    }),
    [active, error, setValue, touched]
  );

  return Object.assign(input.current, {
    value: active ? value : format(value),
    onBlur,
    onChange,
    onFocus,
    meta,
  });
}

export function useMultipleSelect(a) {
  const f = useInput(a);

  const onClick = useCallback(
    e => {
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
