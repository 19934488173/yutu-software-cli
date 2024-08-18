// utils/share-utils/src/sleep.ts
var sleep = (ms = 1e3) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
var sleep_default = sleep;
export {
  sleep_default as default
};
