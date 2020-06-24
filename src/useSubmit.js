import React from "react";

import { mapObject, noop, setErrors } from "./util";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validate = noop,
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const errors = await Promise.all(
        Object.values(inputs).map((i) => {
          i.meta.setTouched(true);
          return i.meta.validate();
        })
      );
      const values = mapObject(inputs, (i) => i.meta.actualValue);
      const hasError =
        errors.some(Boolean) || setErrors(inputs, await validate(values));
      if (hasError) return;

      preSubmit(values);
      setIsSubmitting(true);
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      setErrors(inputs, submitErrors);
      postSubmit(values, submitErrors);
    },
    [handleSubmit, inputs, isSubmitting, postSubmit, preSubmit, validate]
  );

  return [onSubmit, isSubmitting];
}
