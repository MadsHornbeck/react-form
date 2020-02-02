import {
  useCallback,
  useDebugValue,
  useEffect,
  useMemo,
  useState,
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
  const [value, setValue] = useState("");
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

  const onChange = useCallback(
    e => {
      handleChange(e); // TODO: do we want any arguments passed here?
      const eventValue = getEventValue(e);
      setValue(prevValue => parse(eventValue, prevValue));
    },
    [handleChange, parse]
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
      const error = await validate(value);
      setError(error);
    }, 100), // TODO: allow for configuration of delay
    [validate]
  );

  useEffect(() => {
    validation(value);
  }, [validation, value]);

  useDebugValue(value);

  return useMemo(
    () => ({
      meta: {
        active,
        error,
        setActive,
        setError,
        setTouched,
        setValue,
        touched,
      },
      onBlur,
      onChange,
      onFocus,
      value: active ? value : format(value),
    }),
    [active, error, format, onBlur, onChange, onFocus, touched, value]
  );
}
