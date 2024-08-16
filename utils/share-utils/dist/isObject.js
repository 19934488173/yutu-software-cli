// utils/share-utils/src/isObject.ts
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
export {
  isObject as default
};
