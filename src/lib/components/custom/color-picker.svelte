<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import type { Palette } from "$lib/types/color";

	const {
		options,
		selected,
		id,
		size = "default",
		disabled = false,
	}: {
		options: Palette;
		selected: { current: string };
		id?: string;
		size?: "sm" | "default";
		disabled?: boolean;
	} = $props();

	const selectedOption = $derived(options.find((option) => option.color === selected.current));

	function swatch(range: Palette[number]["range"]) {
		return range.at(Math.floor(range.length / 2))?.oklch.long;
	}
</script>

<Select.Root type="single" bind:value={selected.current} {disabled}>
	<Select.Trigger {id} {size} class="w-full capitalize" placeholder="Select Color">
		<div class="flex items-center gap-2">
			{#if selected.current && selectedOption}
				<span
					class="size-3 shrink-0 rounded-xs border border-ring transition-colors ease-out"
					style="background-color: {swatch(selectedOption.range)};"
				></span>
			{/if}
			<Select.Value placeholder="Select color" />
		</div>
	</Select.Trigger>
	<Select.Content class="data-[state=closed]:pointer-events-none">
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
