// commands/init/src/projectTemplate.ts
var getProjectTemplate = () => {
  return [
    {
      name: "React\u9879\u76EE\u6A21\u677F",
      version: "1.0.2",
      npmName: "yutu-software-template-react",
      type: "normal",
      installCommand: "pnpm install",
      startCommand: "pnpm run dev"
    }
  ];
};
var projectTemplate_default = getProjectTemplate;
export {
  projectTemplate_default as default
};
