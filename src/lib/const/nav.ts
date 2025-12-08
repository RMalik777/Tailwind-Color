import type { RouteId } from "$app/types";

type Link = {
	name: string;
	url: RouteId;
};
export const link: Link[] = [
	{
		name: "Home",
		url: "/",
	},
	{
		name: "Compare",
		url: "/compare",
	},
	{
		name: "Gradient",
		url: "/gradient",
	},
	{
		name: "Contrast",
		url: "/contrast",
	},
	{
		name: "Gallery",
		url: "/gallery",
	},
];
