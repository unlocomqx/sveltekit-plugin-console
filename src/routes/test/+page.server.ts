import { add } from '$lib/testfiles/testmodule';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// console.log(import.meta);
	console.log({ test: 'test' });
	return {
		sum: add(1, 2)
	};
};