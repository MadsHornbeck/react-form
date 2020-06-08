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

// TODO: should probably be renamed
export const entriesMap = (obj, fn) =>
  Object.entries(obj).map(([k, v]) => [k, fn(v)]);

export const mapObject = (obj, fn) => Object.fromEntries(entriesMap(obj, fn));
