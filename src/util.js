import React from "react";

export const noop = () => {};
export const id = (a) => a;

export const emptyObj = Object.freeze({});

export const getEventValue = (e) => {
  switch (e.currentTarget.type) {
    case "checkbox":
      return e.currentTarget.checked;
    case "select-multiple":
      return [...e.currentTarget.options]
        .filter((o) => o.selected)
        .map((o) => o.value);
    case "file":
      return e.currentTarget.files;
    default:
      return e.currentTarget.value;
  }
};

export const validateField = (validate) => {
  if (typeof validate === "function") return validate;
  return (value, inputs) => {
    for (const func of validate) {
      const error = func(value, inputs);
      if (error) return error;
    }
  };
};

const createMap = (obj, fn) => {
  const map = new Map(Object.entries(obj));
  for (const k of ["clear", "delete", "set"]) {
    const f = map[k];
    map[k] = (...args) => {
      fn();
      return f.apply(map, args);
    };
  }
  return map;
};

export function useUpdate() {
  const [, up] = React.useState();
  return React.useCallback(() => {
    up({});
  }, []);
}

export function useMap(obj) {
  const update = useUpdate();
  const [map, _setMap] = React.useState(createMap(obj, update));
  const setMap = React.useCallback(
    (obj) => {
      _setMap(createMap(obj, update));
    },
    [update]
  );
  return [map, setMap];
}

export function handleValidate(validate) {
  return typeof validate === "function"
    ? validate
    : async (values, inputs) =>
        Object.fromEntries(
          // TODO: find a more elegant way of handling async validation in object
          await Promise.all(
            Object.entries(validate).map(async ([n, f]) => [
              n,
              await validateField(f)(values[n], inputs),
            ])
          )
        );
}
