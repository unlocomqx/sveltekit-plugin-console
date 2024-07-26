import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { ConsolePlugin } from '$lib';

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
