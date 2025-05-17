import {
	formatHex,
	formatHsl,
	formatRgb,
	converter,
	formatCss,
	convertLabToLch,
	convertRgbToOklab,
	parseHex,
	type Color,
} from "culori";
import { tailwindColors4, tailwindColors3 } from "./color-tailwind";

export const colorV4 = tailwindColors4.map((colorObj) => {
	const { name, shades } = colorObj;
	const range = Object.entries(shades).map(([shade, oklchValue]) => {
		const hex = formatHex(oklchValue);
		const rgb = formatRgb(hex);
		const hsl = formatHsl(hex);
		return {
			name: `${name}-${shade}`,
			shade: Number(shade),
			oklch: {
				long: oklchValue,
				short: oklchValue.replace(/oklch\(/, "").replace(/\)$/, ""),
			},
			hex: {
				long: hex,
				short: hex?.replace(/#/, "").toLocaleUpperCase(),
			},
			hsl: {
				long: hsl,
				short: hsl?.replace(/hsl\(/, "").replace(/\)$/, ""),
			},
			rgb: {
				long: rgb,
				short: rgb?.replace(/rgb\(/, "").replace(/\)$/, ""),
			},
		};
	});

	return {
		color: name,
		range: range,
	};
});

export const colorV3 = tailwindColors3.map((colorObj) => {
	const toOklch = converter("oklch");
	const { name, shades } = colorObj;
	const range = Object.entries(shades).map(([shade, hexValue]) => {
		const oklchRaw = toOklch(hexValue)!;
		const oklch = formatCss({
			mode: "oklch",
			l: (oklchRaw.l * 100).toFixed(1) + "%",
			c: oklchRaw.c?.toFixed(3),
			h: oklchRaw.h?.toFixed(3),
		} as unknown as Color);

		const rgb = formatRgb(hexValue);
		const hsl = formatHsl(hexValue);
		return {
			name: `${name}-${shade}`,
			shade: Number(shade),
			oklch: {
				long: oklch,
				short: oklch?.replace(/oklch\(/, "").replace(/\)$/, ""),
			},
			hex: {
				long: hexValue,
				short: hexValue?.replace(/#/, "").toLocaleUpperCase(),
			},
			hsl: {
				long: hsl,
				short: hsl?.replace(/hsl\(/, "").replace(/\)$/, ""),
			},
			rgb: {
				long: rgb,
				short: rgb?.replace(/rgb\(/, "").replace(/\)$/, ""),
			},
		};
	});

	return {
		color: name,
		range: range,
	};
});
