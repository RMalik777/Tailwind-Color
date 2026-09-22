<script lang="ts">
	import { untrack } from "svelte";

	import * as Select from "$lib/components/ui/select/index";
	import { findShade, resolveShade } from "$lib/functions/color";
	import type { ColorFamily } from "$lib/types/color";

	const {
		options,
		selected,
		id,
		size = "default",
		disabled = false,
	}: {
		options: ColorFamily | undefined;
		selected: { current: string };
		id?: string;
		size?: "sm" | "default";
		disabled?: boolean;
	} = $props();

	const range = $derived(options?.range ?? []);
	const selectedOption = $derived(findShade(range, selected.current));
	let autoShade: string | undefined = $state(undefined);

	function select(value: string) {
		if (selected.current !== value) selected.current = value;
	}

	$effect(() => {
		if (!range.length) return;
		untrack(() => {
			if (range.length === 1) {
				select(range[0].shade.toString());
				autoShade = selected.current;
				return;
			}
			if (selected.current !== autoShade && findShade(range, selected.current)) return;
			select(resolveShade(range, "500"));
			autoShade = selected.current;
		});
	});
</script>

<Select.Root
	type="single"
	value={selected.current}
	onValueChange={(value) => {
		select(value);
		autoShade = undefined;
	}}
	disabled={disabled || range.length < 2}
>
	<Select.Trigger {id} {size} class="w-full capitalize" placeholder="Select Shade">
		<div class="flex items-center gap-2">
			{#if selected.current && selectedOption}
				<span
					class="size-3 shrink-0 rounded-xs border border-ring transition-colors ease-out"
					style="background-color: {selectedOption.oklch?.long};"
				></span>
			{/if}
			<Select.Value class="tracking-tight tabular-nums" placeholder="Select a shade" />
		</div>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Shade</Select.Label>
			{#each range as option (option.shade)}
				<Select.Item value={option.shade.toString()} class="tracking-tight capitalize tabular-nums">
					<span
						class="size-3 shrink-0 rounded-xs border border-ring"
						style="background-color: {option.oklch.long};"
					></span>
					{option.name.replace(options?.color + "-", "")}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
