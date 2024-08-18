// utils/share-utils/src/isObject.ts
var isObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
var isObject_default = isObject;
export {
  isObject_default as default
};
