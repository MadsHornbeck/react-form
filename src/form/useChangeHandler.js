import { useEffect, useRef } from "react";

export default function useChangeHandler({ inputs, handlers }) {
  const changedInputs = useChangedInputs(inputs);

  useEffect(() => {
    if (changedInputs.length) {
      changedInputs.forEach(([name]) => {
        handlers[name](inputs);
      });
    }
  }, [changedInputs, handlers, inputs]);
}

function useChangedInputs(inputs) {
  const prev = useRef(null);

  const changedInputs = prev.current?.filter(
    ([name, value]) => inputs[name].value !== value
  );

  useEffect(() => {
    if (prev.current === null || changedInputs.length) {
      prev.current = Object.entries(inputs).map(([name, input]) => [
        name,
        input.value,
      ]);
    }
  }, [changedInputs, inputs]);

  return changedInputs || [];
}
