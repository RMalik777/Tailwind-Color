<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils";
	import { type ClassValue } from "clsx";
	const scroll = $state({
		y: 0,
		x: 0,
	});
	let { children, className }: { children: Snippet; className?: ClassValue } = $props();
</script>

<svelte:window
	onscroll={() => {
		scroll.y = window.scrollY;
		scroll.x = window.scrollX;
	}}
/>
<div
	class={cn(
		scroll.y > 50 ? "shadow-xs" : "shadow-none md:border-transparent md:p-0 md:pt-2",
		"fixed bottom-0 left-0 z-10 m-4 flex w-[calc(100%-theme(space.8))] items-center justify-start gap-2 rounded-sm  border bg-background/90 p-2 backdrop-blur-lg transition-all duration-200 transition-name-[toolbar] *:grow md:sticky md:top-14 md:m-0 md:w-full md:max-w-svw md:gap-4 md:rounded-lg md:*:not-first:grow-0 ",
		className,
	)}
>
	{@render children?.()}
</div>
