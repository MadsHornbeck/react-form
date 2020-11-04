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

export const validateField = (validate) =>
  typeof validate === "function"
    ? validate
    : (value) => {
        for (const func of validate) {
          const error = func(value);
          if (error) return error;
        }
      };

export function useUpdate() {
  const [, update] = React.useState();
  const cb = React.useRef(noop);
  React.useEffect(() => {
    cb.current = () => update({});
    return () => {
      cb.current = noop;
    };
  }, []);
  return () => cb.current();
}

export const inputIdentifier = Symbol("InputIdentifier");

const nestedObjEntries = (obj, pre = "") =>
  Object.entries(obj).reduce((ent, [k, v]) => {
    if (!v) return ent;
    const prefix = !pre ? k : pre + (isUInt(k) ? `[${k}]` : `.${k}`);
    return ent.concat(
      v[inputIdentifier] ? [[prefix, v]] : nestedObjEntries(v, prefix)
    );
  }, []);

const createMap = (obj, fn) => {
  const map = new Map(nestedObjEntries(obj));
  for (const k of ["clear", "delete", "set"]) {
    const f = map[k];
    map[k] = (...args) => {
      fn();
      return f.apply(map, args);
    };
  }
  return map;
};

export function useMap(obj) {
  const update = useUpdate();
  const [map, _setMap] = React.useState(() => createMap(obj, update));
  const setMap = React.useCallback(
    (obj) => {
      _setMap(createMap(obj, update));
    },
    [update]
  );
  return [map, setMap];
}

export const toObj = (entries, fn = id) => {
  const obj = {};
  for (const [k, v] of entries) setM(obj, toPath(k), fn(v));
  return obj;
};

const setM = (obj, [head, ...tail], value) => {
  const temp = obj || (isUInt(head) ? [] : {});
  temp[head] = tail.length ? setM(obj && obj[head], tail, value) : value;
  return temp;
};

export const get = (obj, path) => {
  const p = toPath(path);
  return p.length ? p.reduce((o, h) => o && o[h], obj) : undefined;
};

const toPath = (str = "") => str.split(/[.[\]]/).filter(Boolean);

const isUInt = (str) => /^(?:0|[1-9]\d*)$/.test(str);
