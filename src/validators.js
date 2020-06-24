// TODO: add unit tests for all validation functions

const validateFn = (predicate) => (message) => (value) =>
  value === "" || predicate(value) ? undefined : message;

const pattern = (regex) => {
  if (!(regex instanceof RegExp))
    throw new Error(`${regex} is not a valid regex`);
  return validateFn((value) => regex.test(value));
};

const required = (message) => (value) =>
  value != null && value !== "" ? undefined : message;

const maxLength = (length, message) =>
  validateFn((v) => v != null && String(v).length <= length)(message);

const minLength = (length, message) =>
  validateFn((v) => v != null && String(v).length >= length)(message);

const max = (max, message) => validateFn((v) => v <= max)(message);

const min = (min, message) => validateFn((v) => v >= min)(message);

const greater = (input, message) =>
  validateFn((v) => v < input.meta.actualValue)(message);

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
  return !arr.some(Number.isNaN) && luhnAlgo(arr);
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
  validateFn,
};
