import type { Context } from './types.js';
import MagicString from 'magic-string';
import type { WithScope } from 'ast-kit';
import { babelParse, getLang, walkAST } from 'ast-kit';
import { isConsoleExpression } from './core/utils';
import type { Node } from '@babel/types'

export async function transform(context: Context) {
	const { code, id, options } = context;
	const magicString = new MagicString(code);

	const accepted_langs = ['js', 'ts'];
	const lang = getLang(id);
	if (!accepted_langs.includes(lang)) {
		return
	}
	const program = babelParse(code, getLang(id), {
		sourceFilename: id
	});
	walkAST<WithScope<Node>>(program, {
		enter(node) {
			if (isConsoleExpression(node)) {

			}
		}
	});
}