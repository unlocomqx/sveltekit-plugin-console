import type { Context } from './types.js';
import MagicString from 'magic-string';
import type { WithScope } from 'ast-kit';
import { babelParse, getLang, walkAST } from 'ast-kit';
import { isConsoleExpression } from './core/utils';
import type { Node } from '@babel/types';

export async function transform(context: Context) {
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

				// @ts-expect-error any
				const args = node.arguments;

				const argsStart = args[0].start!;
				const argsEnd = args[args.length - 1].end!;
				const argType = args[0].type;

				const consoleString = magicString.slice(expressionStart, expressionEnd);

				const argsName = magicString.slice(argsStart, argsEnd)
					.toString()
					.replace(/`/g, '')
					.replace(/\n/g, '')
					.replace(/"/g, '');

				if (consoleString) {
					magicString.appendRight(expressionEnd,`;
						globalThis.spc_can_collect() && globalThis.spc_collect([${argsName}]);
						globalThis.spc_ws.send('spc:log', globalThis.spc_stringify([${argsName}]));
					`);
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