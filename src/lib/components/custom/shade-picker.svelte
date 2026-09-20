<script lang="ts">
	import { untrack } from "svelte";
	import type { PersistedState } from "runed";

	import * as Select from "$lib/components/ui/select/index";
	import { findShade, resolveShade } from "$lib/functions/color";
	import type { ColorFamily } from "$lib/types/color";

	const {
		options,
		selected,
		id,
		size = "default",
	}: {
		options: ColorFamily | undefined;
		selected: PersistedState<string>;
		id?: string;
		size?: "sm" | "default";
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
	disabled={range.length < 2}
>
	<Select.Trigger {id} {size} class="w-full capitalize" placeholder="Select Shade">
		{#if selectedOption}
			<div class="flex items-center gap-2">
				<span
					class="size-3 shrink-0 rounded-xs border border-ring transition-colors ease-out"
					style="background-color: {selectedOption.oklch?.long};"
				></span>
				{selectedOption.name.replace(options?.color + "-", "")}
			</div>
		{:else}
			Select Shade
		{/if}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Shade</Select.Label>
			{#each range as option (option.shade)}
				<Select.Item value={option.shade.toString()} class="capitalize">
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
