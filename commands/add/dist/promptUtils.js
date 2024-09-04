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
  message: `\u8BF7\u8F93\u5165\u751F\u6210\u6587\u4EF6\u540D\u79F0`,
  validate: (value) => !value || !value.trim() ? `\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A` : true
};
var getCopyPathPrompt = (defaultPath) => {
  return {
    message: `\u8BF7\u8F93\u5165\u62F7\u8D1D\u7684\u76F8\u5BF9\u8DEF\u5F84`,
    default: defaultPath,
    validate: (value) => !value || !value.trim() ? `\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A` : true
  };
};
export {
  TEMPLATE_TYPE,
  getCopyPathPrompt,
  modulePrompt,
  namePrompt
};
