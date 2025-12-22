import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import codspeedPlugin from "@codspeed/vitest-plugin";

import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit()],
	test: {
		benchmark: {
			reporters: process.env.CODSPEED ? ["codspeed"] : ["default"],
		},
	},
});
