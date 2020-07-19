import React from "react";

import { mapObject, noop } from "./util";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validate = noop,
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const inputErrors = await Promise.all(
        Object.values(inputs).map((i) => {
          i.meta.setTouched(true);
          return i.meta.validate();
        })
      );

      if (inputErrors.some(Boolean) || !(await validate())) return;

      const values = mapObject(inputs, (i) => i.meta.actualValue);
      preSubmit(values);
      setIsSubmitting(true);
      setErrors({});
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      setErrors(submitErrors);
      postSubmit(values, submitErrors);
    },
    [handleSubmit, inputs, isSubmitting, postSubmit, preSubmit, validate]
  );

  return [onSubmit, isSubmitting, errors];
}
