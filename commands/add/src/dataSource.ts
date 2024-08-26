export const ADD_MODE_SECTION = 'section';
export const ADD_MODE_PAGE = 'page';
/** 模版类型选项 */
export const TEMPLATE_TYPE = [
	{ name: '页面模板', value: ADD_MODE_PAGE },
	{ name: '代码片段', value: ADD_MODE_SECTION }
];

export const TEMPLATE_LIST = [
	{ name: '首页', value: 'home', module: 'page', version: '1.0.0' },
	{ name: '页脚', value: 'footer', module: 'page', version: '1.0.0' },
	{
		name: 'useParamsContext',
		value: 'yutu-software-template-section',
		module: 'section',
		version: '1.0.0'
	},
	{ name: '文本', value: 'text', module: 'section', version: '1.0.0' }
];

/** 根据模版数据筛选出页面模版 */
export const PAGE_TEMPLATE_LIST = TEMPLATE_LIST.filter(
	(item) => item.module === 'page'
);
/** 根据模版数据筛选出代码模版 */
export const SECTION_TEMPLATE_LIST = TEMPLATE_LIST.filter(
	(item) => item.module === 'section'
);
