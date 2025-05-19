<script lang="ts">
	import { browser } from "$app/environment";

	import { colorV4, colorV3, colorV2, colorV1, colorV0 } from "$lib/data/color";

	import Copy from "@lucide/svelte/icons/copy";
	import { toast } from "svelte-sonner";

	type Color = "oklch" | "hex" | "hsl" | "rgb";
	const storedView = browser ? (localStorage.getItem("view") as Color | null) : null;
	let view: Color = $state(storedView ?? "hex");

	const versionOptions = [
		{
			name: "Version 4",
			value: "V4",
		},
		{
			name: "Version 3",
			value: "V3",
		},
		{
			name: "Version 2",
			value: "V2",
		},
		{
			name: "Version 1",
			value: "V1",
		},
		{
			name: "Version 0",
			value: "V0",
		},
	];
	const storedVersion = browser ? localStorage.getItem("version") : null;
	let version = $state(storedVersion ?? "V4");
	const color = $derived.by(() => {
		switch (version) {
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

<main class="mx-2 flex flex-col gap-4 pt-16 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10">
	<div class="flex flex-col gap-2">
		<div>
			<label for="version">Tailwind CSS Version</label>
			<select
				name="version"
				id="version"
				class="rounded border border-neutral-500/50 bg-white p-1"
				bind:value={version}
				onchange={() => localStorage.setItem("version", version)}
			>
				{#each versionOptions as option (option.value)}
					<option value={option.value}>{option.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="view">Color View</label>
			<select
				name="view"
				id="view"
				class="rounded border border-neutral-500/50 bg-white p-1"
				bind:value={view}
				onchange={() => localStorage.setItem("view", view)}
			>
				<option value="oklch">OKLCH</option>
				<option value="hex">HEX</option>
				<option value="hsl">HSL</option>
				<option value="rgb">RGB</option>
			</select>
		</div>
	</div>

	{#each color as color (color.color)}
		<section class="space-y-1 rounded border border-neutral-500/50 p-2">
			<h2 class="text-xl font-semibold tracking-tight capitalize">{color.color}</h2>
			<div class="flex flex-col gap-2 md:flex-row">
				{#each color.range as shade (shade.name)}
					<div class="group w-full overflow-hidden rounded border border-neutral-500/50">
						<div class="aspect-square h-auto w-full" style="background-color: {shade.oklch.long}">
							<button
								class="float-right m-1 h-fit w-fit rounded p-1 opacity-50 duration-200 group-hover:opacity-100 focus-visible:opacity-100
                {shade.shade > 300
									? 'text-white hover:bg-white/10 focus-visible:bg-white/10'
									: 'text-black hover:bg-black/10 focus-visible:bg-black/10'}"
								onclick={() => {
									navigator.clipboard.writeText(shade[view].long ?? "");
									toast(`Copied ${shade[view].long}`);
								}}
							>
								<Copy class="w-4" />
							</button>
						</div>
						<section class="px-1 py-px font-mono text-sm">
							<h3 class="font-semibold text-nowrap">{shade.name}</h3>
							<p>{shade[view].short}</p>
						</section>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</main>
