<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	import { PersistedState } from "runed";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions } from "$lib/data/option";

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

<div class="flex w-full grow flex-col gap-4 pb-2">
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
	<div class="flex h-full w-full flex-row gap-1">
		{#each color as color (color.color)}
			<div class="flex h-full w-full grow flex-col gap-1">
				{#each color.range as shade (shade.name)}
					<div
						class="group flex h-full w-full items-center justify-center rounded"
						style="background-color:{shade.hex.long}; border: 1px solid {shade.hex.long};"
					>
						<p
							class="hidden text-sm font-semibold duration-150 ease-out group-hover:block starting:opacity-0 {shade.shade >
							400
								? 'text-white'
								: 'text-black'}"
						>
							{shade.name.replace(color.color + "-", "")}
						</p>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
