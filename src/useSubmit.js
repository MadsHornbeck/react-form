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
      const { values, inputs, formErrors } = form.current;
      for (const i of inputs.values()) i.meta.setTouched(true);

      const inputErrors = [...inputs.values()].map((i) => i.meta.inputError);
      const valid =
        !(await Promise.all(inputErrors)).some(Boolean) &&
        (await formErrors) === emptyObj;
      if (valid) setErrors((await handleSubmit(values)) || emptyObj);
      setIsSubmitting(false);
    },
    [form, handleSubmit, isSubmitting]
  );

  return [onSubmit, isSubmitting, errors];
}
