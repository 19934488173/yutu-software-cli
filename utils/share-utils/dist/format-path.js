// utils/share-utils/src/format-path.ts
import path from "path";
var formatPath = (p) => {
  const sep = path.sep;
  return sep === "/" ? p : p.replace(/\\/g, "/");
};
var format_path_default = formatPath;
export {
  format_path_default as default
};
