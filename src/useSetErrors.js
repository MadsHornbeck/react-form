import React from "react";

export default function useSetErrors(inputs) {
  return React.useCallback(
    (errors = {}) => {
      // TODO: find a more elegant way of doing this.
      let hasError = false;
      for (const name in errors) {
        if (!inputs[name]) continue;
        inputs[name].meta.setError(errors[name]);
        if (errors[name]) hasError = true;
      }
      return hasError;
    },
    [inputs]
  );
}
