// TODO: add unit tests for all validation functions

function validateFn(predicate, message, value) {
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

const pattern = (regex) => {
  if (!(regex instanceof RegExp))
    throw new Error(`${regex} is not a valid regex`);
  return validateFn((value) => regex.test(value));
};

const required = (message) => (value) =>
  value != null && value !== "" ? undefined : message;

const maxLength = validateFn((length) => (v) =>
  v != null && String(v).length <= length
);
const minLength = validateFn((length) => (v) =>
  v != null && String(v).length >= length
);

const max = validateFn((max) => (v) => v <= max);
const min = validateFn((min) => (v) => v >= min);

const smaller = validateFn((input) => (v) => v < input.meta.actualValue);
const greater = validateFn((input) => (v) => v > input.meta.actualValue);

const negative = validateFn((v) => v < 0);
const positive = validateFn((v) => v > 0);

const email = pattern(/^[^\s@]+@[^\s@]+\.[^\s@.]+$/i);

// https://en.wikipedia.org/wiki/Luhn_algorithm
const luhnAlgo = (ds) => {
  const sum = [...ds]
    .reverse()
    .map((v, i) => v * ((i % 2) + 1))
    .map((v) => (v > 10 ? v - 9 : v))
    .reduce((a, b) => a + b);
  return sum % 10 === 0;
};

const creditCard = validateFn((str) => {
  const arr = [...str].map(Number);
  return !!arr.length && !arr.some(Number.isNaN) && luhnAlgo(arr);
});

const guid = validateFn(
  (str) =>
    // Can guids even be wrapped in []?
    /(^{.*}$|^\(.*\)$|^\[.*\]$|^[^([{].*[^}\])]$)/.test(str) &&
    /[\da-f]{8}([:-])?[\da-f]{4}\1[1-5][\da-f]{3}\1[\da-f]{4}\1[\da-f]{12}/i.test(
      str
    )
);

// TODO
// const isoDate = () => {};

// TODO: consider if this is the best way to export this.
export default {
  creditCard,
  email,
  greater,
  guid,
  max,
  maxLength,
  min,
  minLength,
  negative,
  pattern,
  positive,
  required,
  smaller,
  validateFn,
};
