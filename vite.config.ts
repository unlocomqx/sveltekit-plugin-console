import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { ConsolePlugin } from './src/lib/index.js';

console.log('start');

export default defineConfig({
	plugins: [
		sveltekit(),
		ConsolePlugin({
			log_on_server: true
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
