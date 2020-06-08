import { useEffect, useState } from "react";

import useChangeHandler from "./useChangeHandler";
import useChanged from "./useChanged";
import useSubmit from "./useSubmit";
import useValidation from "./useValidation";

export default function useForm({
  handleSubmit,
  handlers,
  initialValues,
  inputs,
  postSubmit,
  preSubmit,
  reinitialize, // TODO: figure out a more elegant solution to this exists.
  validate,
}) {
  const [didInit, setDidInit] = useState(false);
  const changedInputs = useChanged({ inputs });

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

  useChangeHandler({ changedInputs, inputs, handlers });
  useValidation({ changedInputs, inputs, validate });
  return useSubmit({
    handleSubmit,
    inputs,
    postSubmit,
    preSubmit,
    validate,
  });
}
