import { bench, describe } from "vitest";
import {
	relativeLuminance,
	hexToLinearRgb,
	contrastValue,
} from "../src/lib/functions/contrast";

describe("Contrast Calculation Benchmarks", () => {
	// Test colors
	const white = "#FFFFFF";
	const black = "#000000";
	const red = "#FF0000";
	const blue = "#0000FF";
	const gray = "#808080";

	bench("hexToLinearRgb - white", () => {
		hexToLinearRgb(white);
	});

	bench("hexToLinearRgb - black", () => {
		hexToLinearRgb(black);
	});

	bench("hexToLinearRgb - colored", () => {
		hexToLinearRgb(red);
	});

	bench("relativeLuminance calculation", () => {
		relativeLuminance(255, 255, 255);
	});

	bench("contrastValue - white vs black", () => {
		contrastValue(1.0, 0.0);
	});

	bench("contrastValue - similar colors", () => {
		contrastValue(0.5, 0.45);
	});

	bench("full contrast workflow - white vs black", () => {
		const { r: r1, g: g1, b: b1 } = hexToLinearRgb(white);
		const { r: r2, g: g2, b: b2 } = hexToLinearRgb(black);
		const l1 = relativeLuminance(r1, g1, b1);
		const l2 = relativeLuminance(r2, g2, b2);
		contrastValue(l1, l2);
	});

	bench("full contrast workflow - colored", () => {
		const { r: r1, g: g1, b: b1 } = hexToLinearRgb(red);
		const { r: r2, g: g2, b: b2 } = hexToLinearRgb(blue);
		const l1 = relativeLuminance(r1, g1, b1);
		const l2 = relativeLuminance(r2, g2, b2);
		contrastValue(l1, l2);
	});

	bench("batch contrast calculations", () => {
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
	});
});
