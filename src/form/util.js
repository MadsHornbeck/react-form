export const noop = () => {};
export const id = a => a;

export const getEventValue = e => e.currentTarget.value;

export const wait = (data, ms = 500) =>
  new Promise(resolve => {
    setTimeout(() => resolve(data), ms);
  });

export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const mapObject = (obj, attr) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v[attr]]));
