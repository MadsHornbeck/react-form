import { useState, useEffect, useCallback, useMemo } from "react";

import { noop, id, getEventValue } from "./util";

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

  const meta = useMemo(
    () => ({
      active,
      error,
      setActive,
      setError,
      setTouched,
      touched,
    }),
    [active, error, touched]
  );

  const onFocus = useCallback(
    e => {
      handleFocus(); // TODO: do we want any arguments passed here?
      setTouched(true);
      setActive(true);
    },
    [handleFocus]
  );

  const onBlur = useCallback(
    e => {
      handleBlur(); // TODO: do we want any arguments passed here?
      setActive(false);
    },
    [handleBlur]
  );

  const onChange = useCallback(
    e => {
      handleChange(); // TODO: do we want any arguments passed here?
      const eventValue = getEventValue(e);
      setValue(prevValue => parse(eventValue, prevValue));
    },
    [handleChange, parse]
  );

  useEffect(() => {
    const error = validate(value);
    setError(error);
  }, [validate, value]);

  return {
    meta,
    onChange,
    onFocus,
    onBlur,
    value: active ? value : format(value),
  };
}
