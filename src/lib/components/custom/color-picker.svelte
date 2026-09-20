<script lang="ts">
	import type { PersistedState } from "runed";

	import * as Select from "$lib/components/ui/select/index";
	import type { Palette } from "$lib/types/color";

	const {
		options,
		selected,
		id,
		size = "default",
	}: {
		options: Palette;
		selected: PersistedState<string>;
		id?: string;
		size?: "sm" | "default";
	} = $props();

	const selectedOption = $derived(options.find((option) => option.color === selected.current));

	function swatch(range: Palette[number]["range"]) {
		return range.at(Math.floor(range.length / 2))?.oklch.long;
	}
</script>

<Select.Root type="single" bind:value={selected.current}>
	<Select.Trigger {id} {size} class="w-full capitalize" placeholder="Select Color">
		{#if selectedOption}
			<div class="flex items-center gap-2">
				<span
					class="size-3 shrink-0 rounded-xs border border-ring transition-colors ease-out"
					style="background-color: {swatch(selectedOption.range)};"
				></span>
				{selectedOption.color}
			</div>
		{:else}
			Select Color
		{/if}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Color</Select.Label>
			{#each options as option (option.color)}
				<Select.Item value={option.color} class="capitalize">
					<span
						class="size-3 shrink-0 rounded-xs border border-ring"
						style="background-color: {swatch(option.range)};"
					></span>
					{option.color}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
