import { useCallback, useState } from "react";

import { noop } from "./util";
import useSetErrors from "./useSetErrors";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validate = noop,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setErrors = useSetErrors(inputs);

  const validation = useCallback(
    async (values) =>
      Object.entries(inputs).some(([, i]) => i.meta.error) ||
      setErrors(await validate(values)),
    [inputs, setErrors, validate]
  );

  const onSubmit = useCallback(
    async (e) => {
      console.log("submit");
      e.preventDefault();
      if (isSubmitting) return;
      const inputEntries = Object.entries(inputs);
      inputEntries.forEach(([, v]) => v.meta.setTouched(true));

      const values = Object.fromEntries(
        inputEntries.map(([k, v]) => [k, v.meta.actualValue])
      );
      const hasError = await validation(values);

      if (hasError) {
        const errors = Object.fromEntries(
          inputEntries.map(([k, v]) => [k, v.meta.error])
        );
        console.log("hasError", errors);
        return;
      }

      preSubmit(values);
      setIsSubmitting(true);
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      setErrors(submitErrors);
      postSubmit(values, submitErrors);
      console.log("Post-submit", values, submitErrors);
    },
    [
      handleSubmit,
      inputs,
      isSubmitting,
      postSubmit,
      preSubmit,
      setErrors,
      validation,
    ]
  );

  return [onSubmit, isSubmitting];
}
