import { useCallback, useState } from "react";

import { noop } from "./util";
import { useSetErrors } from "./useValidation";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validate = noop,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setErrors = useSetErrors(inputs);

  const onSubmit = useCallback(
    async e => {
      console.log("submit");
      e.preventDefault();
      if (isSubmitting) return;
      const inputEntries = Object.entries(inputs);
      inputEntries.forEach(([, v]) => v.meta.setTouched(true));
      const values = Object.fromEntries(
        inputEntries.map(([k, v]) => [k, v.value])
      );

      const hasFormError = setErrors(await validate(values));
      const hasError =
        hasFormError || inputEntries.some(([, v]) => v.meta.error);
      if (hasError) return console.log("hasError");

      preSubmit(values);
      setIsSubmitting(true);
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      postSubmit(values, submitErrors);
      setErrors(submitErrors);
      console.log("Post-submit", submitErrors);
    },
    [
      handleSubmit,
      inputs,
      isSubmitting,
      postSubmit,
      preSubmit,
      setErrors,
      validate,
    ]
  );

  return [onSubmit, isSubmitting];
}
