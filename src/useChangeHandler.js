import React from "react";

import useChanged from "./useChanged";

export default function useChangeHandler({ inputs, handlers = {} }) {
  const changedInputs = useChanged(inputs);
  React.useEffect(() => {
    changedInputs.forEach((name) => {
      if (handlers[name]) handlers[name](inputs);
    });
  }, [changedInputs, handlers, inputs]);
}
