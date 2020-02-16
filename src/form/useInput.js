import {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import { noop, id, getEventValue, debounce } from "./util";

export default function useInput({
  format = id,
  handleBlur = noop,
  handleChange = noop,
  handleFocus = noop,
  parse = id,
  validate = noop,
} = {}) {
  const [value, _setValue] = useState("");
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
    debounce(async value => {
      setError(await validate(value));
    }, 100), // TODO: allow for configuration of delay
    [validate]
  );

  useEffect(() => {
    validation(value);
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

  const input = useRef({
    meta,
    onBlur,
    onChange,
    onFocus,
    value: active ? value : format(value),
  });

  Object.entries({
    value: active ? value : format(value),
    onBlur,
    onChange,
    onFocus,
    meta,
  }).forEach(([name, update]) => {
    input.current[name] = update;
  });

  return input.current;
}
