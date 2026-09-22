<script lang="ts">
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";

	import { Label } from "$lib/components/ui/label/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";
	import CopyButton from "$lib/components/custom/copy-button.svelte";
	import OptionToggle from "$lib/components/custom/option-toggle.svelte";
	import VersionSelect from "$lib/components/custom/version-select.svelte";

	import { getColorsByVersion } from "$lib/data/color";
	import { isLightColor } from "$lib/functions/contrast";
	import { colorOptions } from "$lib/const/option";
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

<div class="flex w-full flex-col gap-8 pt-5 pb-4 md:pt-0">
	<Toolbar>
		<h1 class="hidden text-lg font-semibold tracking-tight md:block md:grow">Color palette</h1>
		<div class="flex items-center gap-2 max-md:grow-0">
			<Label for="version" class="sr-only">Version</Label>
			<VersionSelect id="version" selected={version} class="max-md:w-28" />
		</div>
		<OptionToggle options={colorOptions} selected={view} label="Color format" />
	</Toolbar>

	{#each colors as color (color.color)}
		<section
			animate:flip={{ duration: 200, easing: cubicOut }}
			id={color.color}
			class="grid scroll-mt-32 gap-2 lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-4"
		>
			<h2 class="text-sm font-semibold capitalize lg:pt-1">
				{color.color}
			</h2>
			<ol class="grid grid-cols-4 gap-x-1.5 gap-y-3 sm:grid-cols-6 sm:gap-x-2 md:flex md:gap-1.5">
				{#each color.range as shade (shade.name)}
					{@const viewAs = view.current}
					<li animate:flip={{ duration: 200, easing: cubicOut }} class="group min-w-0 md:flex-1">
						<div
							class="flex aspect-square w-full items-start justify-end rounded-md p-0.5 inset-ring inset-ring-black/10 transition-colors duration-150 ease-out xl:aspect-4/3 dark:inset-ring-white/10"
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
						<div class="mt-1.5 px-0.5">
							<h3 class="text-sm font-semibold tabular-nums">
								{shade.name.replace(color.color + "-", "")}
							</h3>
							<p
								class="font-mono text-xs leading-4 tracking-tight text-muted-foreground"
								title={shade[viewAs]?.long}
							>
								{#each shade[viewAs]?.short.split(" ") ?? [] as part, i (i)}
									<span class="block truncate">{part}</span>
								{/each}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>
