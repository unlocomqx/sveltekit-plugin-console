import { add } from '$lib/testfiles/testmodule';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	click() {
		console.log('default action');

		return {};
	},
	trouble() {
		console.error('You caused trouble on the server');

		return {};
	}
};

export const load: PageServerLoad = ({ url }) => {
	console.log('index.server.ts', { url: url.href });
	console.info('Here is some info');
	console.warn('Here is a warning');
	return {
		sum: add(1, 2)
	};
};