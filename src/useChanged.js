import React from "react";

import { mapObject, get, flattenInputs } from "./util";

const defaultSelect = (i) => i.meta.actualValue;
const defaultCompare = (a, b) => a !== b;

// TODO: document use of this hook
export default function useChanged(
  inputs,
  {
    compare = defaultCompare,
    delay = 200,
    select = defaultSelect, // TODO: maybe find a better name than select.
  } = {}
) {
  const prev = React.useRef(mapObject(inputs, select));
  const [changed, setChanged] = React.useState({});

  React.useEffect(() => {
    const t = setTimeout(() => {
      const next = mapObject(inputs, select);
      const changes = mapObject(inputs, (_, name) =>
        compare(get(next, name), get(prev.current, name))
      );
      if (flattenInputs(inputs).some(([n]) => get(changes, n))) {
        prev.current = next;
        setChanged(changes);
      }
    }, delay);
    return () => {
      clearTimeout(t);
    };
  });

  return changed;
}
