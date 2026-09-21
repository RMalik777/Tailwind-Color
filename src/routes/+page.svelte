<script lang="ts">
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";

	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";
	import CopyButton from "$lib/components/custom/copy-button.svelte";

	import { getColorsByVersion } from "$lib/data/color";
	import { isLightColor } from "$lib/functions/contrast";
	import { versionOptions, colorOptions } from "$lib/const/option";
	import type { ColorFormat, Version } from "$lib/types/color";

	import { PersistedState } from "runed";

	const view = new PersistedState<ColorFormat>("view", "oklch");

	const version = new PersistedState<Version>("version", "V4");
	const colors = $derived(getColorsByVersion(version.current, true));
</script>

<svelte:head>
	<title>Tailwind CSS Color</title>
	<meta
		name="description"
		content="Check out all available Tailwind CSS colors across different versions, from v0 to v4. Compare the old color and gradient with the new one."
	/>
</svelte:head>

<div class="flex w-full flex-col gap-4">
	<Toolbar>
		<h1
			class="hidden text-xl font-medium tracking-tight transition-name-[page-title] sm:pl-1 md:block md:grow"
		>
			Color Palette
		</h1>
		<div class="flex flex-col items-center gap-2 *:max-md:w-full sm:flex-row">
			<Label for="version" class="transition-name-[version-label]">Version</Label>
			<Select.Root type="single" bind:value={version.current}>
				<Select.Trigger
					id="version"
					class="grow bg-background transition-name-[version-select] max-md:w-full"
				>
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
		<div class="flex flex-col items-center gap-2 *:max-md:w-full sm:flex-row">
			<Label for="view" class="transition-name-[view-label]">Color Format</Label>
			<Select.Root type="single" bind:value={view.current}>
				<Select.Trigger
					id="view"
					class="grow bg-background transition-name-[view-select] max-md:w-full"
				>
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
	</Toolbar>

	{#each colors as color (color.color)}
		<section
			animate:flip={{ duration: 200, easing: cubicOut }}
			id={color.color}
			class="space-y-1 rounded-lg border border-border p-2"
		>
			<h2 class="text-xl font-semibold tracking-tight capitalize">
				{color.color}
			</h2>
			<div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:flex md:flex-row">
				{#each color.range as shade (shade.name)}
					{@const viewAs = view.current}
					<div
						animate:flip={{ duration: 200, easing: cubicOut }}
						class="group w-full overflow-hidden rounded-sm border border-border"
					>
						<div
							class="flex aspect-square h-auto w-full items-start justify-end p-0.5 transition-colors duration-150 ease-out"
							style="
              background-color: {version.current === 'V4' ? shade.oklch.long : shade.hex.long};
              view-transition-name: color-{color.color}-{shade.shade};"
						>
							<CopyButton
								value={shade[viewAs]?.long ?? ""}
								label={`${shade.name} in ${viewAs} value`}
								class="rounded-sm pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100
                {isLightColor(shade.hex.long)
									? 'text-black hover:bg-neutral-950/10 hover:text-black focus-visible:bg-neutral-950/10'
									: 'text-white hover:bg-neutral-50/20 hover:text-white focus-visible:bg-neutral-50/10'}"
							></CopyButton>
						</div>
						<section class="px-1.5 py-1 font-mono text-sm tracking-tight md:text-xs lg:text-sm">
							<h3 class="hidden font-bold sm:block md:hidden lg:block">{shade.name}</h3>
							<h3 class="block font-bold sm:hidden md:block lg:hidden">{shade.shade}</h3>
							<p class="tracking-tighter" title={shade[viewAs]?.long}>
								{#each shade[viewAs]?.short.split(" ") ?? [] as part, i (i)}
									<span class="block">{part}</span>
								{/each}
							</p>
						</section>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
