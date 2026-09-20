import type {
	ColorFamily,
	ColorFormat,
	ColorShade,
	Palette,
	RawTailwindColor,
} from "$lib/types/color";
import { converter, formatCss, formatHex, formatHsl, formatRgb, parse, type Color } from "culori";

const toOklch = converter("oklch");

/** Numbers for the named shades used by the early palettes. */
const namedShades: Record<string, number> = {
	white: 50,
	lightest: 100,
	lighter: 200,
	light: 300,
	DEFAULT: 500,
	dark: 600,
	darker: 700,
	darkest: 800,
	black: 900,
};

/**
 * Parses a color from the palette data, which is static and must always be valid.
 * @param value - CSS color string taken from the raw palette data
 * @returns The parsed culori color
 * @throws {Error} If the value is not a color culori can parse
 */
function parseColor(value: string): Color {
	const color = parse(value);
	if (!color) throw new Error(`Invalid color in palette data: ${value}`);
	return color;
}

/**
 * Turns a shade key into a number, so every palette sorts and compares the same way.
 * @param key - Shade key from the raw palette data, e.g. `500`, `DEFAULT` or `light`
 * @returns The numeric shade, 500 for an unknown named key
 */
function shadeNumber(key: string): number {
	const value = Number(key);
	return Number.isNaN(value) ? (namedShades[key] ?? 500) : value;
}

/**
 * Drops the function wrapper, `rgb(1, 2, 3)` becomes `1, 2, 3`.
 * @param value - Full CSS color value
 * @param fn - Name of the color function to strip, e.g. `rgb`
 * @returns The value without its wrapper
 */
function unwrap(value: string, fn: string): string {
	return value.replace(`${fn}(`, "").replace(/\)$/, "");
}

/**
 * Builds one shade from the same color already written in every format.
 * @param family - Color family name, e.g. `red`
 * @param key - Shade key from the raw palette data, e.g. `500`
 * @param css - Full CSS value of the color per format
 * @returns The shade with a name, a numeric shade and a long and short form per format
 */
function toShade(family: string, key: string, css: Record<ColorFormat, string>): ColorShade {
	return {
		name: `${family}-${key}`,
		shade: shadeNumber(key),
		oklch: { long: css.oklch, short: unwrap(css.oklch, "oklch") },
		hex: { long: css.hex, short: css.hex.replace("#", "").toLocaleUpperCase() },
		hsl: { long: css.hsl, short: unwrap(css.hsl, "hsl") },
		rgb: { long: css.rgb, short: unwrap(css.rgb, "rgb") },
	};
}

/**
 * Processes a palette whose source data is written in hex, which is every version before V4.
 * @param colorPalette - Raw palette data, one entry per color family
 * @returns The palette with every shade in all four formats
 * @throws {Error} If the palette data holds a color culori cannot parse
 */
export function processColorFromHex(colorPalette: RawTailwindColor[]): Palette {
	return colorPalette.map(({ name, shades }) => ({
		color: name,
		range: Object.entries(shades).map(([key, hex]) => {
			const color = parseColor(hex);
			const oklch = toOklch(color);
			return toShade(name, key, {
				oklch: formatCss({
					mode: "oklch",
					l: (oklch.l * 100).toFixed(1) + "%",
					c: oklch.c?.toFixed(3),
					h: oklch.h?.toFixed(3),
				} as unknown as Color),
				hex,
				hsl: formatHsl(color),
				rgb: formatRgb(color),
			});
		}),
	}));
}

/**
 * Processes a palette whose source data is written in oklch, which is V4.
 * @param colorPalette - Raw palette data, one entry per color family
 * @returns The palette with every shade in all four formats
 * @throws {Error} If the palette data holds a color culori cannot parse
 */
export function processColorFromOklch(colorPalette: RawTailwindColor[]): Palette {
	return colorPalette.map(({ name, shades }) => ({
		color: name,
		range: Object.entries(shades).map(([key, oklch]) => {
			const hex = formatHex(parseColor(oklch));
			// HSL and RGB come from the rounded hex so every format shows the same color.
			const hexColor = parseColor(hex);
			return toShade(name, key, {
				oklch,
				hex,
				hsl: formatHsl(hexColor),
				rgb: formatRgb(hexColor),
			});
		}),
	}));
}

/**
 * Finds a color family by name, e.g. `red`.
 * @param palette - Palette to search
 * @param color - Family name a color picker holds
 * @returns The family, or `undefined` when the palette has no such family
 */
export function findFamily(palette: Palette, color: string): ColorFamily | undefined {
	return palette.find((family) => family.color === color);
}

/**
 * Finds a shade by the string value a shade picker holds.
 * @param range - Shades of one family, `undefined` when no family is picked
 * @param shade - Shade as a string, e.g. `"500"`
 * @returns The shade, or `undefined` when the range has no such shade
 */
export function findShade(range: ColorShade[] | undefined, shade: string): ColorShade | undefined {
	return range?.find((option) => option.shade.toString() === shade);
}

/**
 * Keeps the shade valid after a color family change. Black and white only
 * carry one shade, and the V0 palette uses a different shade set entirely,
 * so fall back to whatever the new family has closest to 500.
 * @param range - Shades of the newly picked family
 * @param current - Shade the shade picker holds right now
 * @returns The current shade when the new family has it, the closest shade to 500 otherwise
 */
export function resolveShade(range: ColorShade[] | undefined, current: string): string {
	if (!range?.length) return current;
	if (findShade(range, current)) return current;
	const closest = range.reduce((a, b) =>
		Math.abs(b.shade - 500) < Math.abs(a.shade - 500) ? b : a,
	);
	return closest.shade.toString();
}
