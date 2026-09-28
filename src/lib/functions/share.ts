import { tick } from "svelte";
import { afterNavigate, replaceState } from "$app/navigation";
import { resolve } from "$app/paths";

import { interpolationOptions, versionOptions } from "$lib/const/option";
import type { ColorSelection, Gradient, Version } from "$lib/types/color";

/**
 * Applies the settings of a shared link, then clears them from the address bar. The page keeps
 * no query string of its own, so a link is only made by the share button and the address bar
 * never holds settings that no longer match the screen. Must be called while a component
 * initializes.
 * @param route - Route of the page, the address bar is set back to it
 * @param apply - Copies the settings in the query parameters onto the page
 */
export function readSharedLink(
	route: "/compare" | "/contrast" | "/gradient",
	apply: (params: URLSearchParams) => void,
) {
	// Search params can not be read while prerendering, afterNavigate only runs in the browser.
	afterNavigate(({ to }) => {
		const params = to?.url.searchParams;
		if (!params || params.size === 0) return;
		apply(params);
		// On the first load the router finishes starting right after this callback, and
		// replaceState throws before that.
		void tick().then(() => replaceState(resolve(route), {}));
	});
}

/**
 * Writes a color and its shade as one URL value.
 * @param color - Family name, e.g. `red`
 * @param shade - Shade as a string, e.g. `"500"`
 * @returns The joined value, e.g. `red-500`
 */
export function colorParam(color: string, shade: string): string {
	return `${color}-${shade}`;
}

/**
 * Reads a color written by `colorParam`.
 * @param value - URL value, e.g. `red-500`
 * @returns The color and shade, or `undefined` when the value is missing or malformed
 */
export function parseColorParam(value: string | null): ColorSelection | undefined {
	const match = value?.match(/^([a-z]+)-(\d+)$/);
	if (!match) return;
	return { color: match[1], shade: match[2] };
}

/**
 * Reads a Tailwind version from the URL.
 * @param value - URL value, e.g. `V4`
 * @returns The version, or `undefined` when it is not a known version
 */
export function parseVersion(value: string | null): Version | undefined {
	return versionOptions.find((option) => option.value === value)?.value;
}

/**
 * Reads an interpolation from the URL.
 * @param value - URL value, e.g. `oklab`
 * @returns The interpolation, or `undefined` when it is not one of the options
 */
export function parseInterpolation(value: string | null): string | undefined {
	return interpolationOptions.find((option) => option.value === value)?.value;
}

/**
 * Reads a finite number from the URL.
 * @param value - URL value, e.g. `90`
 * @returns The number, or `undefined` when the value is missing or not a number
 */
export function parseNumber(value: string | null): number | undefined {
	if (value === null || value.trim() === "") return;
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
}

/**
 * Reads gradient color stops written as `start-end`.
 * @param value - URL value, e.g. `0-100`
 * @returns Start and end position in percent, or `undefined` when either is out of range
 */
export function parseStops(value: string | null): number[] | undefined {
	const stops = value?.split("-").map(parseNumber);
	if (stops?.length !== 2) return;
	if (!stops.every((stop) => stop !== undefined && stop >= 0 && stop <= 100)) return;
	return stops as number[];
}

/**
 * Writes one gradient of the compare view as a single URL value.
 * @param gradient - Gradient to write
 * @returns The fields joined by `_`, e.g. `V4_red-500_blue-500_oklab_90_0-100`
 */
export function gradientParam(gradient: Gradient): string {
	return [
		gradient.version,
		colorParam(gradient.fromColor, gradient.fromShade),
		colorParam(gradient.toColor, gradient.toShade),
		gradient.interpolation,
		gradient.degree,
		gradient.stops.join("-"),
	].join("_");
}

/**
 * Reads a gradient written by `gradientParam`.
 * @param value - URL value
 * @param id - Id to give the gradient
 * @returns The gradient, or `undefined` when any field is missing or invalid
 */
export function parseGradientParam(value: string, id: number): Gradient | undefined {
	const [rawVersion, rawFrom, rawTo, rawInterpolation, rawDegree, rawStops] = value.split("_");
	const version = parseVersion(rawVersion ?? null);
	const from = parseColorParam(rawFrom ?? null);
	const to = parseColorParam(rawTo ?? null);
	const interpolation = parseInterpolation(rawInterpolation ?? null);
	const degree = parseNumber(rawDegree ?? null);
	const stops = parseStops(rawStops ?? null);
	if (!version || !from || !to || !interpolation || degree === undefined || !stops) return;
	return {
		id,
		version,
		fromColor: from.color,
		fromShade: from.shade,
		toColor: to.color,
		toShade: to.shade,
		interpolation,
		degree,
		stops,
	};
}
