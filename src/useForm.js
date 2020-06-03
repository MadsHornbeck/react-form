import { useEffect, useState } from "react";

import useSubmit from "./useSubmit";
import useChangeHandler from "./useChangeHandler";
import useValidation from "./useValidation";

export default function useForm({
  inputs,
  handlers,
  preSubmit,
  postSubmit,
  handleSubmit,
  validate,
  initialValues,
  reinitialize, // TODO: figure out a more elegant solution to this exists.
}) {
  const [didInit, setDidInit] = useState(false);

  useEffect(() => {
    setDidInit(!reinitialize);
  }, [reinitialize]);

  useEffect(() => {
    if (didInit) return;
    for (const n in initialValues) {
      if (!inputs[n]) continue;
      inputs[n].meta.setValue(initialValues[n]);
    }
    setDidInit(true);
  }, [didInit]); // eslint-disable-line react-hooks/exhaustive-deps

  useChangeHandler({ inputs, handlers });
  useValidation({ inputs, validate });
  return useSubmit({
    handleSubmit,
    inputs,
    postSubmit,
    preSubmit,
    validate,
  });
}
