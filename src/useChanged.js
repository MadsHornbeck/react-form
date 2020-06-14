import React from "react";

import { mapObject } from "./util";

const defaultSelect = (i) => i.meta.actualValue;
const defaultCompare = (a, b) => a !== b;

export default function useChanged({
  compare = defaultCompare,
  delay = 200,
  inputs,
  select = defaultSelect, // TODO: maybe find a better name than select.
}) {
  const prev = React.useRef(mapObject(inputs, select));
  const [changedInputs, setChangedInputs] = React.useState([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const changes = Object.entries(inputs)
        .filter(([name, input]) => compare(select(input), prev.current[name]))
        .map(([name]) => name);
      if (changes.length) {
        prev.current = mapObject(inputs, select);
        setChangedInputs(changes);
      }
    }, delay);
    return () => {
      clearTimeout(t);
    };
  });

  return changedInputs;
}
