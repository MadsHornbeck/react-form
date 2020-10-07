import React from "react";

import { emptyObj, mapObject } from "./util";

export default function useSubmit({ handleSubmit, inputs, validateForm }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState(emptyObj);
  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);

      const inputErrors = await Promise.all(
        Object.values(inputs).map((i) => {
          i.meta.setTouched(true);
          return i.meta.validate();
        })
      );
      const hasErrors = inputErrors.some(Boolean) || !(await validateForm());

      if (!hasErrors) {
        const values = mapObject(inputs, (i) => i.meta.actualValue);
        setErrors((await handleSubmit(values)) || emptyObj);
      }
      setIsSubmitting(false);
    },
    [handleSubmit, inputs, isSubmitting, validateForm]
  );

  return [onSubmit, isSubmitting, errors];
}
