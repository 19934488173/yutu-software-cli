// commands/add/src/promptUtils.ts
var TEMPLATE_TYPE = [
  {
    name: "\u4EE3\u7801\u7247\u6BB5",
    value: "fragment"
  },
  {
    name: "\u7EC4\u4EF6",
    value: "component"
  }
];
var modulePrompt = {
  message: "\u8BF7\u9009\u62E9\u4EE3\u7801\u590D\u7528\u7C7B\u578B",
  choices: TEMPLATE_TYPE
};
var namePrompt = {
  message: `\u751F\u6210\u4EE3\u7801\u6587\u4EF6\u540D\uFF1A`,
  validate: (value) => !value || !value.trim() ? `\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A` : true
};
var namePatterns = {
  swr: /^use(-[a-z]+)+$/,
  context: /^use[A-Z][a-zA-Z]*Context$/,
  component: /^[A-Z][a-zA-Z]*$/
};
var defaultValues = {
  swr: "use-example",
  context: "useExampleContext",
  component: "MyExample"
};
var errorMessages = {
  swr: "\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F use-xxx \u6216 use-xxx-xxx \u683C\u5F0F",
  context: '\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F\u4EE5 "use" \u5F00\u5934\uFF0C\u9A7C\u5CF0\u547D\u540D\uFF0C\u4E14\u4EE5 "Context" \u7ED3\u5C3E',
  component: "\u540D\u79F0\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u5FC5\u987B\u662F\u4EE5\u5927\u5199\u5B57\u6BCD\u5F00\u5934\u7684\u9A7C\u5CF0\u547D\u540D\u683C\u5F0F"
};
var getNamePrompt = (type) => ({
  message: `\u751F\u6210\u4EE3\u7801\u6587\u4EF6\u540D\uFF1A`,
  default: defaultValues[type],
  validate: (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
    }
    const regex = namePatterns[type];
    if (regex && !regex.test(trimmedValue)) {
      return errorMessages[type];
    }
    return true;
  }
});
var getCopyPathPrompt = (defaultPath) => {
  return {
    message: `\u4EE3\u7801\u751F\u6210\u5728\u54EA\u4E2A\u6587\u4EF6\u4E0B\uFF1F`,
    default: defaultPath,
    validate: (value) => !value || !value.trim() ? `\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A` : true
  };
};
export {
  TEMPLATE_TYPE,
  getCopyPathPrompt,
  getNamePrompt,
  modulePrompt,
  namePrompt
};
