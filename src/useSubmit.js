import { useCallback, useState } from "react";

import { mapObject, noop, setErrors } from "./util";

export default function useSubmit({
  handleSubmit,
  inputs,
  postSubmit = noop,
  preSubmit = noop,
  validate = noop,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      console.log("submit");
      e.preventDefault();
      if (isSubmitting) return;
      for (const name in inputs) {
        inputs[name].meta.setTouched(true);
      }
      const values = mapObject(inputs, (i) => i.meta.actualValue);

      const hasError =
        Object.values(inputs).some((i) => i.meta.error) ||
        setErrors(inputs, await validate(values));

      if (hasError) {
        const errors = mapObject(inputs, (i) => i.meta.error);
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
    [handleSubmit, inputs, isSubmitting, postSubmit, preSubmit, validate]
  );

  return [onSubmit, isSubmitting];
}
