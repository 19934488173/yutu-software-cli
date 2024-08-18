import { Spinner } from 'cli-spinner';

//加载中状态
const spinnerStart = (msg: string, spinnerString = '|/-\\') => {
	const spinner = new Spinner(msg + ' %s');
	spinner.setSpinnerString(spinnerString);
	spinner.start();
	return spinner;
};

export default spinnerStart;
