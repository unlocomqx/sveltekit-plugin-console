import type { Node } from '@babel/types';

export function isConsoleExpression(node: Node) {
	return node.type === 'CallExpression'
		&& node.callee.type === 'MemberExpression'
		&& node.callee.object.type === 'Identifier'
		&& node.callee.object.name === 'console'
		&& node.callee.property.type === 'Identifier'
		&& node.arguments?.length > 0;
}