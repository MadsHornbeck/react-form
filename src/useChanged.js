import React from "react";

import { emptyObj } from "./util";

export default function useChanged(delay = 200) {
  const [changed, setChanged] = React.useState(emptyObj);
  const changedList = React.useRef([]);
  const timeout = React.useRef();

  const inputChanged = React.useCallback(
    (name) => {
      changedList.current.push([name, true]);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setChanged(Object.fromEntries(changedList.current));
        changedList.current = [];
      }, delay);
    },
    [delay]
  );

  React.useEffect(() => {
    setChanged(emptyObj);
  }, [changed]);

  React.useEffect(() => clearTimeout(timeout.current), []);

  return [changed, inputChanged];
}
