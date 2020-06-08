import React from "react";

import { mapObject } from "./util";

// TODO: consider using this in `useForm` and passing into `useChangeHandler` and `useValidation` to limit recalculation.
export default function useChanged(inputs, fn = (i) => i?.meta.actualValue) {
  const prev = React.useRef(mapObject(inputs, fn));
  const [changedInputs, setChangedInputs] = React.useState([]);
  React.useEffect(() => {
    // TODO: consider whether setTimeout should be used
    setTimeout(() => {
      // TODO: maybe find a more elegant way of doing this.
      const changes = [];
      for (const name in inputs) {
        if (fn(inputs[name]) !== prev.current[name]) {
          changes.push(name);
        }
      }
      if (changes.length) {
        prev.current = mapObject(inputs, fn);
        setChangedInputs(changes);
      }
    }, 0);
  }, [fn, inputs]);
  return changedInputs;
}
