import { useCallback, useState } from "react";

import { noop, wait } from "./util";

export default function useForm({
  inputs,
  preSubmit = noop,
  postSubmit = noop,
  handleSubmit = wait,
  validate = noop,
  // For testing
  //validate = ({ test }) => wait(test === "asdf" && { test: "henning" }),
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleErrors = useCallback(
    (errors = {}) => {
      const errorEntries = Object.entries(errors).filter(([k]) => inputs[k]);
      errorEntries.forEach(([k, e]) => {
        inputs[k].meta.setError(e);
      });
      return !!errorEntries.length;
    },
    [inputs]
  );

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

      const hasFormError = handleErrors(await validate(values));
      const hasError =
        hasFormError || inputEntries.some(([, v]) => v.meta.error);
      if (hasError) return console.log("hasError");

      preSubmit(values);
      setIsSubmitting(true);
      const submitErrors = await handleSubmit(values);
      setIsSubmitting(false);
      postSubmit();
      handleErrors(submitErrors);
      console.log("Post-submit", submitErrors);
    },
    [
      handleErrors,
      handleSubmit,
      inputs,
      isSubmitting,
      postSubmit,
      preSubmit,
      validate,
    ]
  );

  return [onSubmit, isSubmitting];
}
