import { add } from "$lib/testfiles/testmodule";
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	default() {
		console.log('default action');

		return {}
	}
}

export const load: PageServerLoad = () => {
	// console.log(import.meta);
	console.log('index.server.ts')
	return {
		sum: add(1, 2),
	};
};