/** Tailwind CSS release a palette comes from. */
export type Version = "V4" | "V3" | "V2" | "V1" | "V0";

/** Formats every shade is available in. */
export type ColorFormat = "oklch" | "hex" | "hsl" | "rgb";

/** One color written out in a single format. */
export type FormattedColor = {
	/** Full CSS value, e.g. `oklch(63.7% 0.237 25.331)` or `#ef4444`. */
	long: string;
	/** Value without the function wrapper or `#`, e.g. `63.7% 0.237 25.331` or `EF4444`. */
	short: string;
};

/** Palette entry as written in the Tailwind source, before it is processed into a `ColorFamily`. */
export type RawTailwindColor = {
	name: string;
	/** Shade key (`500`, `DEFAULT`, `light`, ...) to a CSS color. */
	shades: Record<string, string>;
};

/** A single shade of a color family, e.g. `red-500`, in every format. */
export type ColorShade = {
	/** Full color name, e.g. `red-500`. */
	name: string;
	/** Numeric shade, named shades from the early palettes are mapped to a number. */
	shade: number;
} & Record<ColorFormat, FormattedColor>;

/** A color family and all of its shades, e.g. `red` from 50 to 950. */
export type ColorFamily = {
	/** Family name, e.g. `red`. */
	color: string;
	range: ColorShade[];
};

/** Every color family of one Tailwind version. */
export type Palette = ColorFamily[];

/**
 * What a color picker and shade picker hold together. Both are strings because
 * select values are strings, the shade is compared against `ColorShade.shade`.
 */
export type ColorSelection = {
	/** Family name, e.g. `red`. */
	color: string;
	/** Shade as a string, e.g. `"500"`. */
	shade: string;
};

/** One gradient on the compare view of the gradient page. */
export type Gradient = {
	id: number;
	version: Version;
	/** Family name of the start color, e.g. `red`. */
	fromColor: string;
	/** Shade of the start color as a string, e.g. `"500"`. */
	fromShade: string;
	/** Family name of the end color, e.g. `blue`. */
	toColor: string;
	/** Shade of the end color as a string, e.g. `"500"`. */
	toShade: string;
	/** Color space the gradient interpolates in, e.g. `oklab`. */
	interpolation: string;
	/** Angle in degrees. */
	degree: number;
	/** Start and end position in percent. */
	stops: number[];
};

/** Setting of a gradient that can follow Gradient 1. `from` and `to` cover both the color and its shade. */
export type GradientSyncKey = "version" | "from" | "to" | "interpolation" | "degree" | "stops";

/** An entry of a select, `name` is the label and `value` is what gets stored. */
export type Option<T extends string = string> = {
	name: string;
	value: T;
};
