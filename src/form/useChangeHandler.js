import { useEffect, useRef } from "react";

export default function useChangeHandler({ inputs, handlers }) {
  const changedInputs = useChanged(inputs);

  useEffect(() => {
    if (changedInputs.length) {
      changedInputs.forEach(([name]) => {
        if (handlers[name]) handlers[name](inputs);
      });
    }
  }, [changedInputs, handlers, inputs]);
}

export function useChanged(inputs, attrName = "value") {
  const prev = useRef(null);

  const changedInputs = prev.current?.filter(
    ([name, value]) => inputs[name]?.[attrName] !== value
  );

  useEffect(() => {
    if (prev.current === null || changedInputs.length) {
      prev.current = Object.entries(inputs).map(([name, input]) => [
        name,
        input[attrName],
      ]);
    }
  }, [attrName, changedInputs, inputs]);

  return changedInputs || [];
}
