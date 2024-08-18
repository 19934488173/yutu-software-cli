// utils/share-utils/src/spinner-start.ts
import { Spinner } from "cli-spinner";
var spinnerStart = (msg, spinnerString = "|/-\\") => {
  const spinner = new Spinner(msg + " %s");
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
};
var spinner_start_default = spinnerStart;
export {
  spinner_start_default as default
};
