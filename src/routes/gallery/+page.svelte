<script lang="ts">
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";

	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";

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
				return colorV0.filter((color) => color.color !== "black" && color.color !== "white");
			case "V1":
				return colorV1.filter((color) => color.color !== "black" && color.color !== "white");
			case "V2":
				return colorV2.filter((color) => color.color !== "black" && color.color !== "white");
			case "V3":
				return colorV3.filter((color) => color.color !== "black" && color.color !== "white");
			default:
				return colorV4.filter((color) => color.color !== "black" && color.color !== "white");
		}
	});
</script>

<svelte:head>
	<title>Gallery | Tailwind CSS Color</title>
	<meta name="description" content="See all Tailwind CSS colors in one place." />
</svelte:head>

<div class="flex w-full grow flex-col gap-1 pb-1">
	<Toolbar className="max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
		<h1
			class="hidden text-xl font-medium tracking-tight transition-name-[page-title] sm:pl-1 md:block md:grow"
		>
			Gallery
		</h1>
		<div class="flex flex-col gap-2 *:w-full sm:flex-row sm:items-center">
			<Label for="version" class="transition-name-[version-label]">Version</Label>
			<Select.Root type="single" bind:value={version.current}>
				<Select.Trigger size="sm" id="version" class="grow transition-name-[version-select]">
					{versionOptions.find((option) => option.value === version.current)?.name}
				</Select.Trigger>
				<Select.Content preventScroll={false}>
					<Select.Group>
						<Select.Label>Version</Select.Label>
						{#each versionOptions as option (option.value)}
							<Select.Item value={option.value}>{option.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-2 *:w-full sm:flex-row sm:items-center">
			<Label for="view" class="transition-name-[view-label]">Color Format</Label>
			<Select.Root type="single" bind:value={view.current}>
				<Select.Trigger size="sm" id="view" class="grow transition-name-[view-select] ">
					{colorOptions.find((option) => option.value === view.current)?.name}
				</Select.Trigger>
				<Select.Content preventScroll={false}>
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
			class="flex h-8 items-center gap-2 rounded-md border p-2 hover:bg-accent/50 has-aria-checked:border-violet-600 has-aria-checked:bg-violet-50 dark:has-aria-checked:border-violet-900 dark:has-aria-checked:bg-violet-950"
		>
			<Checkbox
				id="toggle-2"
				bind:checked={border.current}
				class="rounded-[3px] data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white dark:data-[state=checked]:border-violet-700 dark:data-[state=checked]:bg-violet-700"
			/>
			<p class="text-sm leading-none font-medium">Border</p>
		</Label>
		<Label
			class="flex h-8 items-center gap-2 rounded-md border p-2 hover:bg-accent/50 has-aria-checked:border-violet-600 has-aria-checked:bg-violet-50 dark:has-aria-checked:border-violet-900 dark:has-aria-checked:bg-violet-950"
		>
			<Checkbox
				id="toggle-2"
				bind:checked={gap.current}
				class="rounded-[3px] data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white dark:data-[state=checked]:border-violet-700 dark:data-[state=checked]:bg-violet-700"
			/>
			<p class="text-sm leading-none font-medium">Gap</p>
		</Label>
	</Toolbar>

	<div
		class="flex h-full w-full flex-row duration-150 ease-out {gap.current
			? 'gap-0.5 sm:gap-1'
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
						? 'gap-0.5 sm:gap-1'
						: 'gap-0'}"
				>
					{#each color.range as shade (shade.name)}
						<button
							animate:flip={{ duration: 200, delay: 200, easing: quintOut }}
							class="group flex h-full w-full items-center justify-center transition-all duration-150 ease-out
              {gap.current ? 'rounded-xs' : 'rounded-none'} 
              {border.current ? 'border' : ''}"
							style="
                background-color: {version.current === 'V4' ? shade.oklch.long : shade.hex.long};
                view-transition-name: color-{color.color}-{shade.shade};"
							onclick={() => {
								navigator.clipboard.writeText(shade[view.current].long ?? "");
								toast(`Copied ${shade[view.current].long}`);
							}}
						>
							<span
								class="hidden text-xs font-semibold tracking-tight opacity-95 duration-150 ease-out group-hover:block sm:text-sm starting:opacity-0
                {shade.shade > 400 ? 'text-white' : 'text-black'}"
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
