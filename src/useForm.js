import React from "react";

import useChangeHandler from "./useChangeHandler";
import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";

export default function useForm({
  handleSubmit,
  handlers,
  initialValues = {},
  inputs,
  postSubmit,
  preSubmit,
  validate,
}) {
  const changedInputs = useChanged({ inputs });

  const setValues = React.useCallback(
    (initValues) => {
      Object.entries(initValues)
        .filter(([name]) => inputs[name])
        .forEach(([name, value]) => inputs[name].meta.setValue(value));
    },
    [inputs]
  );

  React.useEffect(() => {
    setValues(initialValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useChangeHandler({ changedInputs, inputs, handlers });
  useValidation({ changedInputs, inputs, validate });
  const [onSubmit, isSubmitting] = useSubmit({
    handleSubmit,
    inputs,
    postSubmit,
    preSubmit,
    validate,
  });

  // TODO: figure out if this is the best way to do this.
  return React.useMemo(() => ({ onSubmit, isSubmitting, setValues, inputs }), [
    inputs,
    isSubmitting,
    onSubmit,
    setValues,
  ]);
}
