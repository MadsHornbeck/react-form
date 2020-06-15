export const noop = () => {};
export const id = (a) => a;

export const getEventValue = (e) => {
  switch (e.currentTarget.type) {
    case "checkbox":
      return e.currentTarget.checked;
    case "select-multiple":
    default:
      return e.currentTarget.value;
  }
};

export function setErrors(inputs, errors = {}) {
  const errs = Object.entries(errors).filter(([name]) => inputs[name]);
  errs.forEach(([name, error]) => inputs[name].meta.setError(error));
  return !!errs.length;
}

// TODO: should probably be renamed
export const entriesMap = (obj, fn) =>
  Object.entries(obj).map(([k, v]) => [k, fn(v, k)]);

export const mapObject = (obj, fn) => Object.fromEntries(entriesMap(obj, fn));

const compose = (arr) => (value, inputs) =>
  arr.reduce((err, f) => (err ? err : f(value, inputs)), undefined);

export const validateField = (f) => (typeof f === "function" ? f : compose(f));

// TODO: reconsider this name
export const handleValidate = (validate) => (values, inputs) =>
  typeof validate === "function"
    ? validate
    : mapObject(validate, (f, name) => validateField(f)(values[name], inputs));
