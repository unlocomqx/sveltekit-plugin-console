import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { ConsolePlugin } from 'sveltekit-plugin-console';

console.log('start');

export default defineConfig({
	plugins: [
		sveltekit(),
		ConsolePlugin({
			log_on_server: false
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
