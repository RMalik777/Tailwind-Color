import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";

export default defineConfig({
	plugins: [codspeedPlugin(), tailwindcss(), enhancedImages(), sveltekit()],
	test: {
		benchmark: {
			reporters: process.env.CODSPEED ? ["codspeed"] : ["default"],
		},
		projects: [
			{
				extends: "./vite.config.ts",

				test: {
					name: "client",

					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"],
				},
			},

			{
				extends: "./vite.config.ts",

				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
				},
			},
		],
		plugins: [tailwindcss(), enhancedImages(), sveltekit()],
	},
});
