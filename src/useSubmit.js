import React from "react";

import { emptyObj } from "./util";

export default function useSubmit(form, handleSubmit) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState(emptyObj);

  const onSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      const { values, inputErrors, inputs, formErrors } = form.current;
      for (const i of inputs.values()) i.meta.setTouched(true);

      const inpErrs = await Promise.all(Object.values(inputErrors));
      const valid = !inpErrs.some(Boolean) && !(await formErrors);
      if (valid) setErrors((await handleSubmit(values)) || emptyObj);
      setIsSubmitting(false);
    },
    [form, handleSubmit, isSubmitting]
  );

  return [onSubmit, isSubmitting, errors];
}
