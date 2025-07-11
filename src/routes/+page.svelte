<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions, colorOptions } from "$lib/data/option";
	import type { Color } from "$lib/types/color";

	import Copy from "@lucide/svelte/icons/copy";
	import { PersistedState } from "runed";
	import { toast } from "svelte-sonner";

	let view = new PersistedState<Color>("view", "oklch");

	const version = new PersistedState("version", "V4");
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

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<Label for="version">Tailwind CSS Version</Label>
			<Select.Root type="single" bind:value={version.current}>
				<Select.Trigger id="version">
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
			<Label for="view">View Color</Label>
			<Select.Root type="single" bind:value={view.current}>
				<Select.Trigger id="view">
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
		<section id={color.color} class="space-y-1 rounded-md border border-neutral-500/50 p-2">
			<h2 class="text-xl font-semibold tracking-tight capitalize">
				{color.color}
			</h2>
			<div class="flex flex-col gap-2 md:flex-row">
				{#each color.range as shade (shade.name)}
					{@const viewAs = view.current}
					<div class="group w-full overflow-hidden rounded-sm border border-neutral-500/50">
						<div class="aspect-square h-auto w-full" style="background-color: {shade.oklch.long}">
							<Button
								variant="ghost"
								size="icon"
								class="float-right m-1 h-fit w-fit rounded-xs p-1
                {shade.shade > 300
									? 'text-white hover:bg-neutral-50/20 hover:text-white focus-visible:bg-neutral-50/10'
									: 'text-black hover:bg-neutral-950/10 hover:text-black focus-visible:bg-neutral-950/10'}"
								onclick={() => {
									navigator.clipboard.writeText(shade[viewAs].long ?? "");
									toast(`Copied ${shade[viewAs].long}`);
								}}
							>
								<Copy class="w-4" />
							</Button>
						</div>
						<section class="px-1 py-px font-mono text-sm">
							<h3 class="font-semibold text-nowrap">{shade.name}</h3>
							<p>{shade[viewAs].short}</p>
						</section>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
