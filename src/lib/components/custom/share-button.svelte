<script lang="ts">
	import { Button, type ButtonProps } from "$lib/components/ui/button/index";
	import { cn } from "$lib/utils";

	import CheckIcon from "@lucide/svelte/icons/check";
	import LinkIcon from "@lucide/svelte/icons/link";
	import { toast } from "svelte-sonner";

	const {
		params,
		class: className,
		variant = "outline",
		size = "sm",
		duration = 2000,
		...props
	}: {
		/** Query parameters that describe the current view. */
		params: URLSearchParams;
		duration?: number;
	} & ButtonProps = $props();

	let clicked = $state(false);
	let timeoutRef = $state<ReturnType<typeof setTimeout> | null>(null);

	const iconClass = "absolute inset-0 duration-150 ease-out";
	const hiddenClass = "opacity-0 blur-xs";
	const visibleClass = "opacity-100 blur-none";

	$effect(() => () => timeoutRef && clearTimeout(timeoutRef));
</script>

<Button
	type="button"
	{variant}
	{size}
	class={className}
	onclick={async () => {
		// The address bar never holds the settings, so the link is built from them.
		const url = `${window.location.origin}${window.location.pathname}?${params}`;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			toast.error("Could not copy the link");
			return;
		}
		clicked = true;
		toast.success("Link copied to clipboard");
		if (timeoutRef) clearTimeout(timeoutRef);
		timeoutRef = setTimeout(() => (clicked = false), duration);
	}}
	{...props}
>
	<span class="relative size-3.5 shrink-0">
		<CheckIcon class={cn(iconClass, "size-3.5", clicked ? visibleClass : hiddenClass)} />
		<LinkIcon class={cn(iconClass, "size-3.5", clicked ? hiddenClass : visibleClass)} />
	</span>
	Share
</Button>
