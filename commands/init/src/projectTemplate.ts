import { IProjectTemplate } from './types';

// 获取项目模板
const getProjectTemplate = (): IProjectTemplate[] => {
	// 这里可以替换成真正的 API 请求
	// return await request({ url: '/project/template' });
	return [
		{
			name: 'React项目模板',
			version: '1.0.2',
			npmName: 'yutu-software-template-react',
			type: 'normal',
			installCommand: 'pnpm install',
			startCommand: 'pnpm run dev'
		}
	];
};

export default getProjectTemplate;
