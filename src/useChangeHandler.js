import React from "react";

export default function useChangeHandler({
  changedInputs,
  inputs,
  handlers = {},
}) {
  React.useEffect(() => {
    changedInputs.forEach((name) => {
      if (handlers[name]) handlers[name](inputs);
    });
  }, [changedInputs, handlers, inputs]);
}
