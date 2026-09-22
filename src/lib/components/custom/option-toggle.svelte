<script lang="ts" generics="T extends string">
	import type { PersistedState } from "runed";

	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import type { Option } from "$lib/types/color";
	import { cn } from "$lib/utils";

	const {
		options,
		selected,
		label,
		class: className,
	}: {
		options: Option<T>[];
		selected: PersistedState<T>;
		label: string;
		class?: string;
	} = $props();
</script>

<!-- Segmented control: one option is always on, clicking the active one keeps it. -->
<ToggleGroup.Root
	type="single"
	size="sm"
	spacing={0.5}
	aria-label={label}
	value={selected.current}
	onValueChange={(value) => {
		if (value) selected.current = value as T;
	}}
	class={cn("h-8 min-w-0 rounded-lg bg-muted p-0.5", className)}
>
	{#each options as option (option.value)}
		<ToggleGroup.Item
			value={option.value}
			class="h-7 grow rounded-md px-2 text-muted-foreground hover:bg-transparent data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-xs sm:px-2.5 dark:data-[state=on]:bg-input/60"
		>
			{option.name}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
