import { add } from "$lib/testfiles/testmodule";
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	default() {
		console.log('default action');

		return {}
	}
}

export const load: PageServerLoad = (event) => {
	console.log('index.server.ts', event)
	return {
		sum: add(1, 2),
	};
};