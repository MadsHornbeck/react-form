export const inputSymbol = Symbol("input");
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
    default:
      return e.currentTarget.value;
  }
};

export const mapObject = (obj, fn, n) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      v[inputSymbol] ? fn(v, n ? `${n}.${k}` : k) : mapObject(v, fn, k),
    ])
  );

const compose = (arr) => (value, inputs) =>
  arr.reduce((err, f) => (err ? err : f(value, inputs)), undefined);

export const validateField = (f) => (typeof f === "function" ? f : compose(f));

// TODO: reconsider this name
export const handleValidate = (validate) =>
  typeof validate === "function"
    ? validate
    : (values, inputs) =>
        mapObject(validate, (f, name) =>
          validateField(f)(get(values, name), inputs)
        );

export const flattenInputs = (inputs) => {
  return Object.entries(inputs)
    .map(([k, i]) =>
      i[inputSymbol]
        ? [k, i]
        : flattenInputs(i).map(([a, b]) => [`${k}.${a}`, b])
    )
    .reduce((acc, i) => acc.concat(i[1][inputSymbol] ? [i] : i), []);
};

const toPath = (str) => str.split(/[.[\]]/).filter(Boolean);

export const get = (obj, path) => toPath(path).reduce((o, k) => o && o[k], obj);
