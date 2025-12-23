/**
 * Calculates the relative luminance of a color using the sRGB color space.
 * @param r - Red channel value (already gamma-corrected, 0-1 range)
 * @param g - Green channel value (already gamma-corrected, 0-1 range)
 * @param b - Blue channel value (already gamma-corrected, 0-1 range)
 * @returns The relative luminance value (0-1 range)
 */
export function relativeLuminance(r: number, g: number, b: number): number {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Converts an 8-bit RGB color channel value to its linearized form.
 * Applies gamma correction according to the sRGB specification.
 * @param color - RGB channel value (0-255 range)
 * @returns Linearized color value (0-1 range)
 */
export function calculateRGB(color: number) {
	const normalizedColor = color / 255;
	return normalizedColor <= 0.04045
		? normalizedColor / 12.92
		: Math.pow((normalizedColor + 0.055) / 1.055, 2.4);
}

/**
 * Processes a hex color string and converts it to linearized RGB values.
 * @param color - Hex color string in the format #RRGGBB
 * @returns Object containing linearized RGB values (0-1 range)
 * @throws {Error} If the hex color format is invalid
 */
export function processColorFromHex(color: string) {
	if (!/^#[0-9A-F]{6}$/i.test(color)) {
		throw new Error("Invalid hex color format. Expected format: #RRGGBB");
	}
	const r = Number.parseInt(color.slice(1, 3), 16);
	const g = Number.parseInt(color.slice(3, 5), 16);
	const b = Number.parseInt(color.slice(5, 7), 16);

	const rs = calculateRGB(r);
	const gs = calculateRGB(g);
	const bs = calculateRGB(b);

	return {
		r: rs,
		g: gs,
		b: bs,
	};
}

/**
 * Calculates the contrast ratio between two luminance values.
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color.
 * @param l1 - First luminance value (0-1 range)
 * @param l2 - Second luminance value (0-1 range)
 * @returns Contrast ratio rounded to 2 decimal places (range: 1-21)
 */
export function contrastValue(l1: number, l2: number): number {
	if (l1 > l2) {
		return Number.parseFloat(((l1 + 0.05) / (l2 + 0.05)).toFixed(2));
	} else {
		return Number.parseFloat(((l2 + 0.05) / (l1 + 0.05)).toFixed(2));
	}
}
