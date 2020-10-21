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
      fn({});
      return f.apply(map, args);
    };
  }
  return map;
};

export function useMap(obj) {
  const [, update] = React.useState();
  const [map, _setMap] = React.useState(createMap(obj, update));
  const setMap = React.useCallback((obj) => {
    _setMap(createMap(obj, update));
  }, []);

  return [map, setMap];
}
