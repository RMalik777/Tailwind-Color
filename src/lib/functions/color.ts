import type { TailwindColor } from "$lib/data/color-tailwind";
import { converter, formatCss, formatHex, formatHsl, formatRgb, type Color } from "culori";

export function processColorFromHex(colorPalette: TailwindColor[]) {
	return colorPalette.map((colorObj) => {
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

			let shadeValue = Number(shade);
			if (isNaN(shadeValue)) {
				switch (shade) {
					case "darkest":
						shadeValue = 800;
						break;
					case "darker":
						shadeValue = 700;
						break;
					case "dark":
						shadeValue = 600;
						break;
					case "DEFAULT":
						shadeValue = 500;
						break;
					case "light":
						shadeValue = 300;
						break;
					case "lighter":
						shadeValue = 200;
						break;
					case "lightest":
						shadeValue = 100;
						break;
					case "white":
						shadeValue = 50;
						break;
					case "black":
						shadeValue = 900;
						break;
					default:
						shadeValue = 500;
						break;
				}
			}
			return {
				name: `${name}-${shade}`,
				shade: shadeValue,
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
}

export function processColorFromOklch(colorPalette: TailwindColor[]) {
	return colorPalette.map((colorObj) => {
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
}
