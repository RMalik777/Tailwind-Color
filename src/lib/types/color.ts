export type { TailwindColor } from "$lib/data/color-tailwind";
export type { ColorLists } from "$lib/data/color";
export type { Version } from "$lib/types/version";

export type Color = "oklch" | "hex" | "hsl" | "rgb";

export type ColorRange = {
	name: string;
	shade: number;
	oklch: {
		long: string;
		short: string;
	};
	hex: {
		long: string;
		short: string;
	};
	hsl: {
		long: string;
		short: string;
	};
	rgb: {
		long: string;
		short: string;
	};
};

export type ColorOption = {
	name: string;
	value: Color;
};
export type InterpolationOption = {
	name: string;
	value: string;
};
export type VersionOption = {
	name: string;
	value: Version;
};
