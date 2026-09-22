<script lang="ts">
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";

	import { Label } from "$lib/components/ui/label/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";
	import OptionToggle from "$lib/components/custom/option-toggle.svelte";
	import VersionSelect from "$lib/components/custom/version-select.svelte";

	import Grid2x2Icon from "@lucide/svelte/icons/grid-2x2";
	import SquareIcon from "@lucide/svelte/icons/square";

	import { PersistedState } from "runed";
	import { toast } from "svelte-sonner";

	import { getColorsByVersion } from "$lib/data/color";
	import { isLightColor } from "$lib/functions/contrast";
	import { colorOptions } from "$lib/const/option";
	import type { ColorFormat, Version } from "$lib/types/color";

	const border = new PersistedState("border", false);
	const gap = new PersistedState("gap", true);
	const version = new PersistedState<Version>("version", "V4");
	const view = new PersistedState<ColorFormat>("view", "oklch");

	const colors = $derived(getColorsByVersion(version.current, true));

	const toggleOn =
		"data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary";
</script>

<svelte:head>
	<title>Gallery | Tailwind CSS Color</title>
	<meta name="description" content="See all Tailwind CSS colors in one place." />
</svelte:head>

<div class="flex w-full grow flex-col gap-3 pt-4 pb-(--toolbar-space) md:pt-0 md:pb-4">
	<Toolbar className="max-md:flex-wrap">
		<div class="hidden md:block md:grow">
			<h1 class="text-lg font-semibold tracking-tight">Gallery</h1>
			<p class="text-xs text-muted-foreground">Click a swatch to copy its value.</p>
		</div>
		<div class="flex items-center max-md:grow-0">
			<Label for="version" class="sr-only">Version</Label>
			<VersionSelect id="version" selected={version} class="max-md:w-28" />
		</div>
		<OptionToggle options={colorOptions} selected={view} label="Color format" />
		<div class="flex gap-2 max-md:basis-full">
			<Toggle variant="outline" size="sm" bind:pressed={border.current} class="h-8 grow {toggleOn}">
				<SquareIcon />Border
			</Toggle>
			<Toggle variant="outline" size="sm" bind:pressed={gap.current} class="h-8 grow {toggleOn}">
				<Grid2x2Icon />Gap
			</Toggle>
		</div>
	</Toolbar>

	<div
		class="flex h-full w-full flex-row overflow-x-auto duration-150 ease-out {gap.current
			? 'gap-0.5 sm:gap-1'
			: 'gap-0'}"
	>
		{#each colors as color (color.color)}
			{@const uppercaseColor = color.color.charAt(0).toUpperCase() + color.color.slice(1)}
			<div
				animate:flip={{ duration: 200, easing: quintOut }}
				class="flex w-full min-w-10 grow flex-col"
			>
				<div class="relative h-6 w-full">
					<p
						title={uppercaseColor}
						class="absolute top-0 right-0 w-full truncate text-center text-xs font-medium text-muted-foreground capitalize"
					>
						{uppercaseColor}
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
              {gap.current ? 'rounded-sm' : 'rounded-none'}
              {border.current ? 'border border-ring' : ''}"
							style="
                background-color: {version.current === 'V4' ? shade.oklch.long : shade.hex.long};
                view-transition-name: color-{color.color}-{shade.shade};"
							onclick={() => {
								navigator.clipboard.writeText(shade[view.current].long ?? "");
								toast(`Copied ${shade[view.current].long}`);
							}}
						>
							<span
								class="hidden text-xs font-semibold tracking-tight opacity-95 duration-150 ease-out group-hover:block group-focus-visible:block sm:text-sm starting:opacity-0
                {isLightColor(shade.hex.long) ? 'text-black' : 'text-white'}"
							>
								{shade.name.replace(color.color + "-", "")}
							</span>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<p class="text-xs text-muted-foreground md:hidden">Tap a swatch to copy its value.</p>
</div>
