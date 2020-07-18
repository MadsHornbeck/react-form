// TODO: add unit tests for all validation functions

export function /*#__PURE__*/ validateFn(predicate, message, value) {
  if (typeof predicate !== "function")
    throw new TypeError("predicate is not a function");

  if (
    arguments.length < validateFn.length ||
    arguments.length <= predicate.length
  )
    return (...args) => validateFn(...arguments, ...args);

  const valid = predicate(value);
  if (typeof valid !== "function")
    return value === "" || valid ? undefined : message;

  const args = [...arguments].slice(1);
  return validateFn(
    predicate(...args.slice(0, predicate.length)),
    ...args.slice(predicate.length)
  );
}

export const pattern = /*#__PURE__*/ (regex) => {
  if (!(regex instanceof RegExp))
    throw new Error(`${regex} is not a valid regex`);
  return validateFn((value) => regex.test(value));
};

export const required = /*#__PURE__*/ (message) => (value) =>
  value != null && value !== "" ? undefined : message;

export const maxLength = /*#__PURE__*/ validateFn((length) => (v) =>
  v != null && String(v).length <= length
);

export const minLength = /*#__PURE__*/ validateFn((length) => (v) =>
  v != null && String(v).length >= length
);

export const max = /*#__PURE__*/ validateFn((max) => (v) => v <= max);
export const min = /*#__PURE__*/ validateFn((min) => (v) => v >= min);

export const smaller = /*#__PURE__*/ validateFn((input) => (v) =>
  v < input.meta.actualValue
);
export const greater = /*#__PURE__*/ validateFn((input) => (v) =>
  v > input.meta.actualValue
);

export const negative = /*#__PURE__*/ (v) => v < 0;
export const positive = /*#__PURE__*/ (v) => v > 0;

export const email = /*#__PURE__*/ pattern(/^[^\s@]+@[^\s@]+\.[^\s@.]+$/i);

// https://en.wikipedia.org/wiki/Luhn_algorithm
const luhnAlgo = (ds) => {
  const sum = [...ds]
    .reverse()
    .map((v, i) => v * ((i % 2) + 1))
    .map((v) => (v > 10 ? v - 9 : v))
    .reduce((a, b) => a + b);
  return sum % 10 === 0;
};

export const creditCard = /*#__PURE__*/ validateFn((str) => {
  const arr = [...str].map(Number);
  return !!arr.length && !arr.some(Number.isNaN) && luhnAlgo(arr);
});

export const guid = /*#__PURE__*/ validateFn(
  (str) =>
    // Can guids even be wrapped in []?
    /(^{.*}$|^\(.*\)$|^\[.*\]$|^[^([{].*[^}\])]$)/.test(str) &&
    /[\da-f]{8}([:-])?[\da-f]{4}\1[1-5][\da-f]{3}\1[\da-f]{4}\1[\da-f]{12}/i.test(
      str
    )
);

// TODO
// const isoDate = () => {};
