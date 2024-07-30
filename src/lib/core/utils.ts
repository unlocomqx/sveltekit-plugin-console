import type { CallExpression, Node } from '@babel/types';

export function isConsoleExpression(node: Node): node is CallExpression {
	return node.type === 'CallExpression'
		&& node.callee.type === 'MemberExpression'
		&& node.callee.object.type === 'Identifier'
		&& node.callee.object.name === 'console'
		&& node.callee.property.type === 'Identifier'
		&& node.arguments?.length > 0;
}

export function isConsoleClearExpression(node: Node): node is CallExpression {
	return node.type === 'CallExpression'
		&& node.callee.type === 'MemberExpression'
		&& node.callee.object.type === 'Identifier'
		&& node.callee.object.name === 'console'
		&& node.callee.property.type === 'Identifier'
		&& node.callee.property.name === 'clear';
}