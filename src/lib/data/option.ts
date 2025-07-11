import type { ColorOption, VersionOption } from "$lib/types/color";

export const colorOptions: ColorOption[] = [
	{ name: "OKLCH", value: "oklch" },
	{ name: "HEX", value: "hex" },
	{ name: "HSL", value: "hsl" },
	{ name: "RGB", value: "rgb" },
];

export const versionOptions: VersionOption[] = [
	{
		name: "Version 4",
		value: "V4",
	},
	{
		name: "Version 3",
		value: "V3",
	},
	{
		name: "Version 2",
		value: "V2",
	},
	{
		name: "Version 1",
		value: "V1",
	},
	{
		name: "Version 0",
		value: "V0",
	},
];
