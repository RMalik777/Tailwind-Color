<script lang="ts">
	import * as Select from "#lib/components/ui/select/index.js";
	import { versionOptions } from "#lib/const/option.ts";
	import type { Version } from "#lib/types/color.ts";
	import { cn } from "#lib/utils.ts";

	const {
		selected,
		id,
		size = "default",
		disabled = false,
		class: className,
	}: {
		selected: { current: Version };
		id?: string;
		size?: "sm" | "default";
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<Select.Root type="single" bind:value={selected.current} {disabled}>
	<Select.Trigger {id} {size} class={cn("w-full", className)}>
		{versionOptions.find((option) => option.value === selected.current)?.name ?? "Select version"}
	</Select.Trigger>
	<Select.Content preventScroll={false}>
		<Select.Group>
			<Select.Label>Tailwind CSS</Select.Label>
			{#each versionOptions as option (option.value)}
				<Select.Item value={option.value}>{option.name}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
