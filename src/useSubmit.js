import React from "react";

import { emptyObj, mapObject, noop, flattenInputs } from "./util";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validateForm,
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState(emptyObj);

  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const inputErrors = await Promise.all(
        flattenInputs(inputs).map(([, i]) => {
          i.meta.setTouched(true);
          return i.meta.validate();
        })
      );

      if (inputErrors.some(Boolean) || (await validateForm())) return;

      const values = mapObject(inputs, (i) => i.meta.actualValue);
      preSubmit(values);
      setIsSubmitting(true);
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      setErrors(submitErrors || emptyObj);
      postSubmit(values, submitErrors);
    },
    [handleSubmit, inputs, isSubmitting, postSubmit, preSubmit, validateForm]
  );

  return [onSubmit, isSubmitting, errors];
}
