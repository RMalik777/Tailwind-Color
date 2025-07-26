import {
	tailwindColors4,
	tailwindColors3,
	tailwindColors2,
	tailwindColors1,
	tailwindColors0,
} from "./color-tailwind";

import { processColorFromHex, processColorFromOklch } from "$lib/functions/color";

export const colorV4 = processColorFromOklch(tailwindColors4);
export const colorV3 = processColorFromHex(tailwindColors3);
export const colorV2 = processColorFromHex(tailwindColors2);
export const colorV1 = processColorFromHex(tailwindColors1);
export const colorV0 = processColorFromHex(tailwindColors0);
