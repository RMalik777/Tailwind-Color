<script lang="ts">
	import { Button, type ButtonProps } from "$lib/components/ui/button/index";
	import { cn } from "$lib/utils";

	import CheckIcon from "@lucide/svelte/icons/check";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import { toast } from "svelte-sonner";

	const {
		value,
		label,
		class: className,
		variant = "ghost",
		size = "icon-sm",
		duration = 2000,
		...props
	}: {
		value: string;
		label: string;
		duration?: number;
	} & ButtonProps = $props();

	let clicked = $state(false);
	let timeoutRef = $state<number | null>(null);

	const iconClass = "absolute duration-150 ease-out";
	const hiddenClass = "opacity-0 blur-xs";
	const visibleClass = "opacity-100 blur-none";

	$effect(() => () => timeoutRef && clearTimeout(timeoutRef));
</script>

<Button
	type="button"
	{variant}
	{size}
	class={cn("relative", className)}
	onclick={async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			toast.error(`Could not copy ${label}`);
			return;
		}
		clicked = true;
		toast.success(`${label} copied to clipboard`);
		if (timeoutRef) clearTimeout(timeoutRef);
		timeoutRef = setTimeout(() => (clicked = false), duration);
	}}
	{...props}
>
	<CheckIcon class={cn(iconClass, clicked ? visibleClass : hiddenClass)} />
	<CopyIcon class={cn(iconClass, clicked ? hiddenClass : visibleClass)} />
	<span class="sr-only">Copy {label}</span>
</Button>
