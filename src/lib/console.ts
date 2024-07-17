import { PLUGIN_NAME } from './constants.js';
import { cwd } from 'node:process';
import { relative } from 'pathe';
import { transform } from './transformer';
import type { Plugin } from 'vite';
import type { Context } from './types';

export function ConsolePlugin(): Plugin {
	return {
		name: PLUGIN_NAME,
		enforce: 'pre',

		configureServer(server) {
			import.meta.ws = server.ws;
			globalThis.vite_ws = server.ws;
			server.ws.on('connection', () => {
				server.ws.send('my:greetings', { msg: 'hello' });
			});
		},

		async transform(code, id, options) {
			if (!code?.includes('console')
				|| /node_modules/.test(id)
				|| !/\/src\//.test(id)) {
				return;
			}

			try {
				const context: Context = {
					code,
					id,
					options
				};

				return await transform(context);
			} catch (error) {
				console.error(`[${PLUGIN_NAME}]`, `Transform ${relative(cwd(), id)} error:`, error);
				return code;
			}
		}
	};
}