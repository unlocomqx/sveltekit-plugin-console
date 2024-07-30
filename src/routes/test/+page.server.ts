import { add } from '$lib/testfiles/testmodule';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	console.clear();
	console.log(import.meta);
	console.log('test.server.ts');
	return {
		sum: add(1, 2)
	};
};