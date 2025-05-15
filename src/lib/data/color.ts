import { formatHex, formatHsl, formatRgb } from "culori";
import { tailwindColors } from "./color-tailwind";

export const color = tailwindColors.map((colorObj) => {
	const { name, shades } = colorObj;
	const range = Object.entries(shades).map(([shade, oklchValue]) => {
		return {
			name: `${name}-${shade}`,
			shade: Number(shade),
			oklch: {
				long: oklchValue,
				short: oklchValue.replace(/oklch\(/, "").replace(/\)$/, ""),
			},
			hex: {
				long: formatHex(oklchValue)?.toLocaleUpperCase(),
				short: formatHex(oklchValue)?.replace(/#/, "").toLocaleUpperCase(),
			},
			hsl: {
				long: formatHsl(oklchValue),
				short: formatHsl(oklchValue)?.replace(/hsl\(/, "").replace(/\)$/, ""),
			},
			rgb: {
				long: formatRgb(oklchValue),
				short: formatRgb(oklchValue)?.replace(/rgb\(/, "").replace(/\)$/, ""),
			},
		};
	});

	return {
		color: name,
		range: range,
	};
});
