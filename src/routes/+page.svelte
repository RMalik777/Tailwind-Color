<script lang="ts">
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";

	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions, colorOptions } from "$lib/data/option";
	import type { Color } from "$lib/types/color";

	import Copy from "@lucide/svelte/icons/copy";
	import { PersistedState } from "runed";
	import { toast } from "svelte-sonner";

	const view = new PersistedState<Color>("view", "oklch");

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

<div class="flex grow flex-col gap-4">
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
	</div>

	{#each color as color (color.color)}
		<section
			animate:flip={{ duration: 200, easing: cubicOut }}
			id={color.color}
			class="space-y-1 rounded-md border border-border p-2"
		>
			<h2 class="text-xl font-semibold tracking-tight capitalize">
				{color.color}
			</h2>
			<div class="flex flex-col gap-2 md:flex-row">
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
						<section class="px-1 py-px font-mono text-sm">
							<h3 class="font-semibold text-nowrap">{shade.name}</h3>
							<p>{shade[viewAs]?.short}</p>
						</section>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
