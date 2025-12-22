import { bench, describe } from "vitest";
import { processColorFromHex, processColorFromOklch } from "../src/lib/functions/color";
import { tailwindColors3, tailwindColors4 } from "../src/lib/data/color-tailwind";

describe("Color Processing Benchmarks", () => {
	bench("processColorFromHex - single color", () => {
		processColorFromHex([tailwindColors3[0]]);
	});

	bench("processColorFromHex - 5 colors", () => {
		processColorFromHex(tailwindColors3.slice(0, 5));
	});

	bench("processColorFromHex - all colors", () => {
		processColorFromHex(tailwindColors3);
	});

	bench("processColorFromOklch - single color", () => {
		processColorFromOklch([tailwindColors4[0]]);
	});

	bench("processColorFromOklch - 5 colors", () => {
		processColorFromOklch(tailwindColors4.slice(0, 5));
	});

	bench("processColorFromOklch - all colors", () => {
		processColorFromOklch(tailwindColors4);
	});
});
