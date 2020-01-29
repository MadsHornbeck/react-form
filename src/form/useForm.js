import { useState, useCallback, useMemo } from "react";

import { noop } from "./util";

export default function useForm({
  inputs,
  preSubmit = noop,
  postSubmit = noop,
  handleSubmit = console.log,
  validate = noop,
}) {
  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const inputEntries = Object.entries(inputs);
      const values = Object.fromEntries(
        inputEntries.map(([k, v]) => [k, v.value])
      );
      handleSubmit(values);
    },
    [handleSubmit, inputs]
  );

  return {
    onSubmit,
  };
}
