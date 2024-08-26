import AddCommand from './addCommand';

const add = () => {
	const args = process.argv.slice(2);
	const parsedArgs = JSON.parse(args[0]);
	return new AddCommand(parsedArgs);
};

add();
export default add;
