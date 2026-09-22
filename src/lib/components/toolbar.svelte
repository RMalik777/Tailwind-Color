<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils";
	import { type ClassValue } from "clsx";
	const scroll = $state({
		y: 0,
		x: 0,
	});
	let { children, className }: { children: Snippet; className?: ClassValue } = $props();

	// Below md the toolbar floats over the page, so pages reserve this much room at
	// the bottom to keep their last content clear of it.
	let height = $state(0);
	$effect(() => {
		const root = document.documentElement;
		root.style.setProperty("--toolbar-space", `${height + 32}px`);
		return () => root.style.removeProperty("--toolbar-space");
	});
</script>

<svelte:window
	onscroll={() => {
		scroll.y = window.scrollY;
		scroll.x = window.scrollX;
	}}
/>
<div
	bind:offsetHeight={height}
	class={cn(
		scroll.y > 8 ? "md:border-border" : "md:border-transparent",
		"fixed inset-x-3 bottom-3 z-10 flex items-center gap-2 rounded-xl border bg-background p-2 shadow-lg transition-[border-color] duration-200 *:grow",
		"md:sticky md:inset-x-auto md:top-14 md:bottom-auto md:-mx-6 md:gap-6 md:rounded-none md:border-x-0 md:border-t-0 md:px-6 md:py-3 md:shadow-none md:*:not-first:grow-0 lg:-mx-8 lg:px-8",
		className,
	)}
>
	{@render children?.()}
</div>
