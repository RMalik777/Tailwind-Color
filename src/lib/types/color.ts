export type { TailwindColor } from "$lib/data/color-tailwind";
export type { ColorLists } from "$lib/data/color";

export type Color = "oklch" | "hex" | "hsl" | "rgb";
export type Version = "V4" | "V3" | "V2" | "V1" | "V0";

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
