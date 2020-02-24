export const noop = () => {};
export const id = a => a;

export const getEventValue = e => {
  if (e.currentTarget.type === "checkbox") return e.currentTarget.checked;
  return e.currentTarget.value;
};

export const wait = (data, ms = 500) =>
  new Promise(resolve => {
    setTimeout(() => resolve(data), ms);
  });

export const entriesMap = (obj, attr) =>
  Object.entries(obj).map(([k, v]) => [k, v[attr]]);

export const mapObject = (obj, attr) =>
  Object.fromEntries(entriesMap(obj, attr));
