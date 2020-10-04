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

export const mapObject = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));

const compose = (arr) => (value, inputs) =>
  arr.reduce((err, f) => (err ? err : f(value, inputs)), undefined);

export const validateField = (f) => (typeof f === "function" ? f : compose(f));

// TODO: reconsider this name
export const handleValidate = (validate) =>
  typeof validate === "function"
    ? validate
    : (values, inputs) =>
        mapObject(validate, (f, name) =>
          validateField(f)(values[name], inputs)
        );
