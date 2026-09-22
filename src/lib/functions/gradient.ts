import type { ColorShade, Version } from "$lib/types/color";

/**
 * Interpolation Tailwind CSS uses for its gradient utilities by default.
 * @param version - Tailwind CSS version
 * @returns `oklab` for V4, `srgb` for every version before it
 */
export function defaultInterpolation(version: Version): string {
	return version === "V4" ? "oklab" : "srgb";
}

/**
 * Builds the inline style of a two color linear gradient, written with the
 * same custom properties Tailwind CSS uses so the colors animate on change.
 * @param from - Start shade
 * @param to - End shade
 * @param stops - Start and end position in percent
 * @param degree - Angle of the gradient
 * @param interpolation - Color space the gradient interpolates in, e.g. `oklab`
 * @returns The inline style string
 */
export function gradientStyle(
	from: ColorShade | undefined,
	to: ColorShade | undefined,
	stops: number[],
	degree: number,
	interpolation: string,
): string {
	return `
		--tw-gradient-from: ${from?.oklch.long};
		--tw-gradient-to: ${to?.oklch.long};
		--tw-gradient-from-position: ${stops[0]}%;
		--tw-gradient-to-position: ${stops[1]}%;
		--tw-gradient-position: ${degree}deg in ${interpolation};
		--tw-gradient-stops: var(
			--tw-gradient-via-stops,
			var(--tw-gradient-position),
			var(--tw-gradient-from) var(--tw-gradient-from-position),
			var(--tw-gradient-to) var(--tw-gradient-to-position)
		);
		background-image: linear-gradient(var(--tw-gradient-stops));`;
}
