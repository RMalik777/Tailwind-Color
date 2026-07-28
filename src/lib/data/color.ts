import {
	tailwindColors4,
	tailwindColors3,
	tailwindColors2,
	tailwindColors1,
	tailwindColors0,
} from "./color-tailwind";

import { processColorFromHex, processColorFromOklch } from "$lib/functions/color";
import type { Version } from "$lib/types/color";

export const colorV4 = processColorFromOklch(tailwindColors4);
export const colorV3 = processColorFromHex(tailwindColors3);
export const colorV2 = processColorFromHex(tailwindColors2);
export const colorV1 = processColorFromHex(tailwindColors1);
export const colorV0 = processColorFromHex(tailwindColors0);
export type ColorLists = typeof colorV4;

const colorsByVersion: Record<Version, ColorLists> = {
	V4: colorV4,
	V3: colorV3,
	V2: colorV2,
	V1: colorV1,
	V0: colorV0,
};

/** Looks up the color list for a Tailwind version, optionally dropping the black/white entries. */
export function getColorsByVersion(version: Version, excludeGrayscale = false): ColorLists {
	const colors = colorsByVersion[version] ?? colorV4;
	if (!excludeGrayscale) return colors;
	return colors.filter((color) => color.color !== "black" && color.color !== "white");
}
