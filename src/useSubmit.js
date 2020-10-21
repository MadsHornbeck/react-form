import React from "react";

import { emptyObj } from "./util";

export default function useSubmit({ handleSubmit, inputs, validateForm }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState(emptyObj);

  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      const values = Object.fromEntries(
        [...inputs.entries()].map(([n, i]) => [n, i.meta.actualValue])
      );
      const inputErrors = await Promise.all(
        [...inputs.values()].map((i) => {
          i.meta.setTouched(true);
          return i.meta.validate();
        })
      );
      const valid = !inputErrors.some(Boolean) && (await validateForm());
      if (valid) setErrors((await handleSubmit(values)) || emptyObj);
      setIsSubmitting(false);
    },
    [handleSubmit, inputs, isSubmitting, validateForm]
  );

  return [onSubmit, isSubmitting, errors];
}
