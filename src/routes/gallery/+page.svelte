<script lang="ts">
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";

	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	import { PersistedState } from "runed";
	import { toast } from "svelte-sonner";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { colorOptions, versionOptions } from "$lib/data/option";
	import type { Color } from "$lib/types/color";

	const border = new PersistedState("border", false);
	const gap = new PersistedState("gap", true);
	const version = new PersistedState("version", "V4");
	const view = new PersistedState<Color>("view", "oklch");

	const color = $derived.by(() => {
		switch (version.current) {
			case "V0":
				return colorV0;
			case "V1":
				return colorV1;
			case "V2":
				return colorV2;
			case "V3":
				return colorV3;
			default:
				return colorV4;
		}
	});
</script>

<svelte:head>
	<title>Gallery</title>
	<meta name="description" content="See all Tailwind CSS colors in one place." />
</svelte:head>

<div class="flex w-full grow flex-col gap-1 pb-1">
	<div class="flex flex-col gap-2 pb-3 sm:flex-row sm:gap-4">
		<div class="flex items-center gap-2">
			<Label for="version">Tailwind CSS Version</Label>
			<Select.Root type="single" bind:value={version.current}>
				<Select.Trigger id="version" class="grow">
					{versionOptions.find((option) => option.value === version.current)?.name}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Version</Select.Label>
						{#each versionOptions as option (option.value)}
							<Select.Item value={option.value}>{option.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex items-center gap-2">
			<Label for="view">Color Format</Label>
			<Select.Root type="single" bind:value={view.current}>
				<Select.Trigger id="view" class="grow">
					{colorOptions.find((option) => option.value === view.current)?.name}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Display</Select.Label>
						{#each colorOptions as option (option.value)}
							<Select.Item value={option.value}>{option.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<Label
			class="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent/50 has-[[aria-checked=true]]:border-violet-600 has-[[aria-checked=true]]:bg-violet-50 dark:has-[[aria-checked=true]]:border-violet-900 dark:has-[[aria-checked=true]]:bg-violet-950"
		>
			<Checkbox
				id="toggle-2"
				bind:checked={border.current}
				class="data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white dark:data-[state=checked]:border-violet-700 dark:data-[state=checked]:bg-violet-700"
			/>
			<p class="text-sm leading-none font-medium">Border</p>
		</Label>
		<Label
			class="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent/50 has-[[aria-checked=true]]:border-violet-600 has-[[aria-checked=true]]:bg-violet-50 dark:has-[[aria-checked=true]]:border-violet-900 dark:has-[[aria-checked=true]]:bg-violet-950"
		>
			<Checkbox
				id="toggle-2"
				bind:checked={gap.current}
				class="data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white dark:data-[state=checked]:border-violet-700 dark:data-[state=checked]:bg-violet-700"
			/>
			<p class="text-sm leading-none font-medium">Gap</p>
		</Label>
	</div>
	<div
		class="flex h-full w-full flex-row duration-150 ease-out {gap.current
			? 'gap-[2px] sm:gap-1'
			: 'gap-0'}"
	>
		{#each color as color (color.color)}
			<div animate:flip={{ duration: 200, easing: quintOut }} class="flex w-full grow flex-col">
				<div class="relative h-6 w-full">
					<p
						class="absolute top-0 right-0 w-full truncate text-center text-xs text-muted-foreground capitalize sm:text-sm"
					>
						{color.color}
					</p>
				</div>

				<div
					class="flex h-full w-full grow flex-col duration-150 ease-out {gap.current
						? 'gap-[2px] sm:gap-1'
						: 'gap-0'}"
				>
					{#each color.range as shade (shade.name)}
						<button
							animate:flip={{ duration: 200, delay: 200, easing: quintOut }}
							class="group flex h-full w-full items-center justify-center transition-all duration-150 ease-out
              {gap.current ? 'rounded-xs' : 'rounded-none'} 
              {border.current ? 'border' : ''}"
							style="background-color:{shade.hex.long};"
							onclick={() => {
								navigator.clipboard.writeText(shade[view.current].long ?? "");
								toast(`Copied ${shade[view.current].long}`);
							}}
						>
							<span
								class="hidden text-xs font-semibold tracking-tight opacity-95 duration-150 ease-out group-hover:block sm:text-sm starting:opacity-0 {shade.shade >
								400
									? 'text-white'
									: 'text-black'}"
							>
								{shade.name.replace(color.color + "-", "")}
							</span>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<p class="text-sm text-muted-foreground">Click to copy</p>
</div>
