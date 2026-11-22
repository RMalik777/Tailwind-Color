import { test } from "vitest";
import { relativeLuminance, hexToLinearRgb, contrastValue } from "../src/lib/functions/contrast";

test("Contrast Calculation Benchmarks", async ({ bench }) => {
	// Test colors
	const white = "#FFFFFF";
	const black = "#000000";
	const red = "#FF0000";
	const blue = "#0000FF";
	const gray = "#808080";

	await bench("hexToLinearRgb - white", () => {
		hexToLinearRgb(white);
	}).run();

	await bench("hexToLinearRgb - black", () => {
		hexToLinearRgb(black);
	}).run();

	await bench("hexToLinearRgb - colored", () => {
		hexToLinearRgb(red);
	}).run();

	await bench("relativeLuminance calculation", () => {
		relativeLuminance(255, 255, 255);
	}).run();

	await bench("contrastValue - white vs black", () => {
		contrastValue(1.0, 0.0);
	}).run();

	await bench("contrastValue - similar colors", () => {
		contrastValue(0.5, 0.45);
	}).run();

	await bench("full contrast workflow - white vs black", () => {
		const { r: r1, g: g1, b: b1 } = hexToLinearRgb(white);
		const { r: r2, g: g2, b: b2 } = hexToLinearRgb(black);
		const l1 = relativeLuminance(r1, g1, b1);
		const l2 = relativeLuminance(r2, g2, b2);
		contrastValue(l1, l2);
	}).run();

	await bench("full contrast workflow - colored", () => {
		const { r: r1, g: g1, b: b1 } = hexToLinearRgb(red);
		const { r: r2, g: g2, b: b2 } = hexToLinearRgb(blue);
		const l1 = relativeLuminance(r1, g1, b1);
		const l2 = relativeLuminance(r2, g2, b2);
		contrastValue(l1, l2);
	}).run();

	await bench("batch contrast calculations", () => {
		const colors = [white, black, red, blue, gray];
		for (let i = 0; i < colors.length; i++) {
			for (let j = i + 1; j < colors.length; j++) {
				const { r: r1, g: g1, b: b1 } = hexToLinearRgb(colors[i]);
				const { r: r2, g: g2, b: b2 } = hexToLinearRgb(colors[j]);
				const l1 = relativeLuminance(r1, g1, b1);
				const l2 = relativeLuminance(r2, g2, b2);
				contrastValue(l1, l2);
			}
		}
	}).run();
});
