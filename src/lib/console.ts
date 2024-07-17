import { PLUGIN_NAME } from './constants.js';
import { cwd } from 'node:process';
import { relative } from 'pathe';
import { transform } from './transformer';
import { type Plugin, type WebSocketServer } from 'vite';
import type { Context } from './types';
import stringify from 'fast-safe-stringify';

let collect_logs = true;
let log_drain: string[] = [];

declare global {
	var spc_ws: WebSocketServer;
	var spc_stringify: typeof stringify;
	var spc_collect: (log: string) => void;
}

export function ConsolePlugin(): Plugin {
	return {
		name: PLUGIN_NAME,
		enforce: 'pre',

		configureServer(server) {
			globalThis.spc_ws = server.ws;
			globalThis.spc_stringify = stringify;
			// fancy name for logs collected before the client is ready
			log_drain = [];
			globalThis.spc_collect = function(log: string) {
				log_drain.push(log);
			};
			server.ws.on('spc:log_drain', () => {
				collect_logs = false;
				server.ws.send('spc:log_drain', stringify(log_drain));
				log_drain = [];
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