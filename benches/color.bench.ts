import { test } from "vitest";
import { processColorFromHex, processColorFromOklch } from "../src/lib/functions/color";
import { tailwindColors3, tailwindColors4 } from "../src/lib/data/raw-tailwind-color";

test("Color Processing Benchmarks", async ({ bench }) => {
	await bench("processColorFromHex - single color", () => {
		processColorFromHex([tailwindColors3[0]]);
	}).run();

	await bench("processColorFromHex - 5 colors", () => {
		processColorFromHex(tailwindColors3.slice(0, 5));
	}).run();

	await bench("processColorFromHex - all colors", () => {
		processColorFromHex(tailwindColors3);
	}).run();

	await bench("processColorFromOklch - single color", () => {
		processColorFromOklch([tailwindColors4[0]]);
	}).run();

	await bench("processColorFromOklch - 5 colors", () => {
		processColorFromOklch(tailwindColors4.slice(0, 5));
	}).run();

	await bench("processColorFromOklch - all colors", () => {
		processColorFromOklch(tailwindColors4);
	}).run();
});
