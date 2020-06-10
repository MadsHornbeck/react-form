import React from "react";

export default function useChangeHandler({
  changedInputs,
  inputs,
  handlers = {},
}) {
  React.useEffect(() => {
    changedInputs
      .filter((name) => handlers[name])
      .forEach((name) => handlers[name](inputs));
  }, [changedInputs, handlers, inputs]);
}
