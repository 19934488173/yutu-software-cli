import { IProjectTemplate } from './types';

// 获取项目模板
const getProjectTemplate = (): IProjectTemplate[] => {
	// 这里可以替换成真正的 API 请求
	// return await request({ url: '/project/template' });
	return [
		{
			name: 'React 项目模板',
			version: '1.0.2',
			npmName: 'imooc-cli-dev-template-vue2',
			type: 'normal'
		}
	];
};

export default getProjectTemplate;
