import { useEffect, useRef } from "react";

import { entriesMap } from "./util";

export default function useChangeHandler({ inputs, handlers = {} }) {
  const changedInputs = useChanged(inputs);

  useEffect(() => {
    if (!changedInputs.length) return;
    changedInputs.forEach(([name]) => {
      if (handlers[name]) handlers[name](inputs);
    });
  }, [changedInputs, handlers, inputs]);
}

export function useChanged(inputs, attr = "value") {
  const prev = useRef(null);

  const changedInputs = prev.current?.filter(
    ([name, attrValue]) => inputs[name]?.[attr] !== attrValue
  );

  useEffect(() => {
    if (prev.current === null || changedInputs.length) {
      prev.current = entriesMap(inputs, attr);
    }
  }, [attr, changedInputs, inputs]);

  return changedInputs || [];
}
