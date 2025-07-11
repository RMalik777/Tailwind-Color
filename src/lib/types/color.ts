export type Color = "oklch" | "hex" | "hsl" | "rgb";

export type Version = "V4" | "V3" | "V2" | "V1" | "V0";

export type ColorOption = {
	name: string;
	value: Color;
};
export type VersionOption = {
	name: string;
	value: Version;
};
