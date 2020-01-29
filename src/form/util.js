export const noop = () => {};
export const id = a => a;

export const getEventValue = e => e.currentTarget.value;

export const wait = (data, ms = 500) =>
  new Promise(resolve => {
    setTimeout(() => resolve(data), ms);
  });
