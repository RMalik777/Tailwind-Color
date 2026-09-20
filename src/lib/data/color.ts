import {
	tailwindColors4,
	tailwindColors3,
	tailwindColors2,
	tailwindColors1,
	tailwindColors0,
} from "./raw-tailwind-color";

import { processColorFromHex, processColorFromOklch } from "$lib/functions/color";
import type { Palette, Version } from "$lib/types/color";

export const colorV4 = processColorFromOklch(tailwindColors4);
export const colorV3 = processColorFromHex(tailwindColors3);
export const colorV2 = processColorFromHex(tailwindColors2);
export const colorV1 = processColorFromHex(tailwindColors1);
export const colorV0 = processColorFromHex(tailwindColors0);

const colorsByVersion: Record<Version, Palette> = {
	V4: colorV4,
	V3: colorV3,
	V2: colorV2,
	V1: colorV1,
	V0: colorV0,
};

/**
 * Looks up the palette of a Tailwind version.
 * @param version - Tailwind version to read, falls back to V4 when unknown
 * @param excludeGrayscale - Set to `true` to drop the `black` and `white` families
 * @returns The palette of that version
 */
export function getColorsByVersion(version: Version, excludeGrayscale = false): Palette {
	const colors = colorsByVersion[version] ?? colorV4;
	if (!excludeGrayscale) return colors;
	return colors.filter((color) => color.color !== "black" && color.color !== "white");
}
