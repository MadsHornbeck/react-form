export const noop = () => {};
export const id = (a) => a;

export const getEventValue = (e) => {
  if (e.currentTarget.type === "select-multiple") {
    // e.persist();
    // console.log(e);
    // console.dir(e.currentTarget);
    // console.log(e.target.value);
    return e.currentTarget.value;
  }
  if (e.currentTarget.type === "checkbox") return e.currentTarget.checked;
  return e.currentTarget.value;
};

export const wait = (data, ms = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });

// TODO: should probably be renamed
export const entriesMap = (obj, fn) =>
  Object.entries(obj).map(([k, v]) => [k, fn(v)]);

export const mapObject = (obj, fn) => Object.fromEntries(entriesMap(obj, fn));
