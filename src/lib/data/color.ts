import { formatHex, formatHsl, formatRgb, converter } from "culori";
import { tailwindColors } from "./color-tailwind";

const toHsl = converter("hsl");

export const color = tailwindColors.map((colorObj) => {
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
