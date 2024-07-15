import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { ConsolePlugin } from './src/lib/index.js';

export default defineConfig({
	plugins: [sveltekit(), ConsolePlugin()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
