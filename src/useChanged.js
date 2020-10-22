import React from "react";

export default function useChanged(delay) {
  const [changed, setChanged] = React.useState({});
  const changedList = React.useRef([]);
  const timeout = React.useRef();

  const inputChanged = React.useCallback(
    (name, c) => {
      changedList.current.push([name, c]);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setChanged(Object.fromEntries(changedList.current));
        changedList.current = [];
      }, delay);
    },
    [delay]
  );

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  return [changed, inputChanged];
}
