import type { Context } from './types.js';
import MagicString from 'magic-string';
import type { WithScope } from 'ast-kit';
import { babelParse, getLang, walkAST } from 'ast-kit';
import { isConsoleExpression } from './core/utils.js';
import { isIdentifier, isMemberExpression, type Node } from '@babel/types';
import type { PluginOptions } from '$lib/console.js';

export async function transform(context: Context, plugin_options: PluginOptions) {
	const { code, id, options } = context;
	const magicString = new MagicString(code);

	const accepted_langs = ['js', 'ts'];
	const lang = getLang(id);

	if (!accepted_langs.includes(lang)) {
		return;
	}
	const program = babelParse(code, getLang(id), {
		sourceFilename: id
	});
	walkAST<WithScope<Node>>(program, {
		enter(node) {
			if (isConsoleExpression(node)) {
				const expressionStart = node.start!;
				const expressionEnd = node.end!;

				const originalExpression = magicString.slice(expressionStart, expressionEnd);

				if (originalExpression.includes('%c'))
					return false;

				const { line, column } = node.loc!.start;
				const originalLine = line;
				const originalColumn = column;

				let member = 'log';
				if (isMemberExpression(node.callee) && isIdentifier(node.callee.property)) {
					member = node.callee.property.name;
				}

				const args = node.arguments;
				const argsStart = args[0].start!;
				const argsEnd = args[args.length - 1].end!;

				const consoleString = magicString.slice(expressionStart, expressionEnd);

				const argsName = magicString.slice(argsStart, argsEnd)
					.toString();

				if (consoleString) {
					let log = `{type: ${JSON.stringify(member)}, args: globalThis.spc_stringify([${argsName}])}`;
					magicString.appendRight(expressionEnd, `;
						globalThis.spc_can_collect?.() && globalThis.spc_collect(${log});
						globalThis.spc_ws?.send('spc:log', ${log});
					`);
					if (member === 'log') {
						if (!plugin_options.log_on_server) {
							magicString.appendLeft(expressionStart, 'typeof window !== "undefined" && ');
						}
					}
				}
			}
		}
	});

	return {
		code: magicString.toString(),
		map: magicString.generateMap({
			source: id,
			file: id,
			includeContent: true,
			hires: true
		})
	};
}

export async function injectClientCode(context: Context) {
	const { code, id, options } = context;
	const magicString = new MagicString(code);

	function handleLog(arson: any) {
		const commonStyle = 'padding:2px 5px; border-radius:3px;margin-top:5px;color: #fff; background: #FF3E00;';
		const styles: {
			[type: string]: string;
		} = {
			log: 'background: #FF3E00;',
			info: 'background: #0078D4;',
			warn: 'background: #FFAA00;',
			error: 'background: #D70007;'
		};

		function spc_style(type: string) {
			return commonStyle + (styles[type] ?? '');
		}

		if (import.meta.hot) {
			import.meta.hot.send('spc:log_drain');
			import.meta.hot.on('spc:log_drain', (data) => {
				let items = JSON.parse(data);
				if (Array.isArray(items)) {
					for (let { type, args } of items) {
						console.log('%c#', spc_style(type), ...arson.parse(args));
					}
				}
			});
			import.meta.hot.on('spc:log', ({ type, args }) => {
				console.log('%c#', spc_style(type), ...arson.parse(args));
			});
		}
	}

	magicString.append(`\n import('arson').then(arson => (${handleLog.toString()})(arson));`);

	return {
		code: magicString.toString(),
		map: magicString.generateMap({
			source: id,
			file: id,
			includeContent: true,
			hires: true
		})
	};
}