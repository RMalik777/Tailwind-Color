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
		scroll.y > 50 ? "md:shadow-xs" : "md:border-transparent md:p-0 md:pt-2 md:shadow-none",
		"fixed inset-x-4 bottom-4 z-10 flex items-center justify-start gap-2 rounded-lg border bg-background p-2 shadow-lg transition-all duration-200 transition-name-[toolbar] *:grow md:sticky md:inset-x-auto md:top-14 md:bottom-auto md:w-full md:max-w-svw md:gap-4 md:bg-background/95 md:backdrop-blur-xl md:*:not-first:grow-0",
		className,
	)}
>
	{@render children?.()}
</div>
