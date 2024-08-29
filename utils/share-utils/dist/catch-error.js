// utils/share-utils/src/catch-error.ts
var catchError = (options) => {
  const {
    msg = "",
    error = null,
    exitCode = 1,
    logger = console,
    // 默认使用 console 打印日志
    onErrorHandled
  } = options;
  if (error) {
    logger.error(`${msg} ${error.message}`);
    logger.error(error.stack);
  } else {
    logger.error(`${msg}`);
  }
  if (onErrorHandled && typeof onErrorHandled === "function") {
    onErrorHandled();
  }
  process.exit(exitCode);
};
var catch_error_default = catchError;
export {
  catch_error_default as default
};
