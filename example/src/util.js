export const wait = (data, ms = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });

export const genId = () => Math.random().toString(36).slice(2);

export const splitPascal = (s) => s.match(/[A-Z][a-z]+/g).join(" ");
