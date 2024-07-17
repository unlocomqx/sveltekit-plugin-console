import { PLUGIN_NAME } from './constants.js';
import { cwd } from 'node:process';
import { relative } from 'pathe';
import { injectClientCode, transform } from './transformer';
import { type Plugin, type WebSocketServer } from 'vite';
import type { Context } from './types';
import stringify from 'fast-safe-stringify';

let collect_logs = true;
let log_drain: string[] = [];

declare global {
	var spc_ws: WebSocketServer;
	var spc_stringify: typeof stringify;
	var spc_collect: (log: string) => void;
	var spc_can_collect: () => boolean;
}

export function ConsolePlugin(): Plugin {
	return {
		name: PLUGIN_NAME,
		enforce: 'pre',

		apply: 'serve',

		configureServer(server) {
			globalThis.spc_ws = server.ws;
			globalThis.spc_stringify = stringify;
			// fancy name for logs collected before the client is ready
			log_drain = [];
			globalThis.spc_can_collect = () => collect_logs;
			globalThis.spc_collect = function(log: string) {
				log_drain.push(log);
			};
			server.ws.on('spc:log_drain', () => {
				collect_logs = false;
				server.ws.send('spc:log_drain', stringify(log_drain));
				log_drain = [];
			});

			return () => {
				server.middlewares.use((req, res, next) => {
					// reset log collection on each request
					collect_logs = true;
					log_drain = [];
					next();
				});
			};
		},

		async transform(code, id, options) {
			if(/.svelte-kit\/generated\/root.js/.test(id)){
				const context: Context = {
					code,
					id,
					options
				};
				 return await injectClientCode(context)
			}
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