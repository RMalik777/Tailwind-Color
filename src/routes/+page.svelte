<script lang="ts">
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";

	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions, colorOptions } from "$lib/data/option";
	import type { Color } from "$lib/types/color";

	import Copy from "@lucide/svelte/icons/copy";
	import { PersistedState } from "runed";
	import { toast } from "svelte-sonner";

	const view = new PersistedState<Color>("view", "oklch");
	const scroll = $state({
		y: 0,
		x: 0,
	});

	const version = new PersistedState("version", "V4");
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
	<title>Tailwind CSS Color</title>
	<meta
		name="description"
		content="Check out all available Tailwind CSS colors across different versions, from v0 to v4. Compare the old color and gradient with the new one."
	/>
</svelte:head>

<svelte:window
	onscroll={() => {
		scroll.y = window.scrollY;
		scroll.x = window.scrollX;
	}}
/>

<div class="flex w-full flex-col gap-4">
	<Toolbar>
		<h1
			class="hidden text-xl font-medium tracking-tight transition-name-[page-title] sm:pl-1 md:block md:grow"
		>
			Color Pallete
		</h1>
		<div class="flex flex-col items-center gap-2 *:max-md:w-full sm:flex-row">
			<Label for="version" class="transition-name-[version-label]">Tailwind CSS Version</Label>
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

	{#each color as color (color.color)}
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
							class="aspect-square h-auto w-full transition-colors duration-150 ease-out"
							style="
              background-color: {version.current === 'V4' ? shade.oklch.long : shade.hex.long};"
						>
							<Button
								variant="ghost"
								size="icon"
								class="float-right m-1 h-fit w-fit rounded-xs p-1
                {shade.shade > 300
									? 'text-white hover:bg-neutral-50/20 hover:text-white focus-visible:bg-neutral-50/10'
									: 'text-black hover:bg-neutral-950/10 hover:text-black focus-visible:bg-neutral-950/10'}"
								onclick={() => {
									navigator.clipboard.writeText(shade[viewAs]?.long ?? "");
									toast(`Copied ${shade[viewAs]?.long}`);
								}}
							>
								<Copy class="w-4" />
								<span class="sr-only">Copy color {shade.name} as {viewAs}</span>
							</Button>
						</div>
						<section class="px-1 py-px font-mono text-sm tracking-tight md:text-xs lg:text-sm">
							<h3 class="hidden font-bold sm:block md:hidden lg:block">{shade.name}</h3>
							<h3 class="block font-bold sm:hidden md:block lg:hidden">{shade.shade}</h3>
							<p class="tracking-tighter">{shade[viewAs]?.short}</p>
						</section>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
