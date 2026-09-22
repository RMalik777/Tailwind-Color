<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	import ColorPicker from "$lib/components/custom/color-picker.svelte";
	import ShadePicker from "$lib/components/custom/shade-picker.svelte";
	import VersionSelect from "$lib/components/custom/version-select.svelte";

	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
	import { PersistedState } from "runed";

	import { getColorsByVersion } from "$lib/data/color";
	import { findFamily, findShade } from "$lib/functions/color";
	import { isLightColor } from "$lib/functions/contrast";
	import type { ColorFamily, ColorShade, Palette, Version } from "$lib/types/color";

	const leftVersion = new PersistedState<Version>("leftVersion", "V3");
	const leftColorOptions = $derived(getColorsByVersion(leftVersion.current));
	const leftColor = new PersistedState("leftColor", "red");
	const leftChoice = $derived(findFamily(leftColorOptions, leftColor.current));
	const leftShade = new PersistedState("leftShade", "500");
	const leftSelectedColor = $derived(findShade(leftChoice?.range, leftShade.current));

	const rightVersion = new PersistedState<Version>("rightVersion", "V4");
	const rightColorOptions = $derived(getColorsByVersion(rightVersion.current));
	const rightColor = new PersistedState("rightColor", "red");
	const rightChoice = $derived(findFamily(rightColorOptions, rightColor.current));
	const rightShade = new PersistedState("rightShade", "500");
	const rightSelectedColor = $derived(findShade(rightChoice?.range, rightShade.current));
</script>

{#snippet half(shade: ColorShade | undefined, version: Version)}
	<div
		class="flex min-w-0 flex-1 flex-col justify-end gap-0.5 p-3 transition duration-200 ease-out sm:p-4
		{shade && isLightColor(shade.hex.long) ? 'text-black' : 'text-white'}"
		style="background-color: {version === 'V4' ? shade?.oklch.long : shade?.hex.long}"
	>
		{#if shade}
			<p class="truncate text-sm font-semibold sm:text-base">
				{shade.name}
				<span class="font-normal opacity-70">in {version.replace("V", "v")}</span>
			</p>
			<p class="truncate font-mono text-xs opacity-80">{shade.hex.long}</p>
			<p class="hidden truncate font-mono text-xs opacity-80 sm:block">{shade.oklch.long}</p>
		{:else}
			<p class="text-sm text-foreground">Pick a color</p>
		{/if}
	</div>
{/snippet}

{#snippet controls(
	side: string,
	version: PersistedState<Version>,
	options: Palette,
	color: PersistedState<string>,
	family: ColorFamily | undefined,
	shade: PersistedState<string>,
)}
	<Field.Set class="w-full">
		<Field.Legend>{side === "left" ? "First" : "Second"} color</Field.Legend>
		<Field.Group class="grid min-w-0 flex-1 gap-2 md:grid-cols-3 md:gap-3">
			<Field.Field>
				<Field.Label for="{side}Version">Version</Field.Label>
				<VersionSelect id="{side}Version" selected={version} size="sm" />
			</Field.Field>
			<Field.Field>
				<Field.Label for="{side}Color">Color</Field.Label>
				<ColorPicker id="{side}Color" {options} selected={color} size="sm" />
			</Field.Field>
			<Field.Field>
				<Field.Label for="{side}Shade">Shade</Field.Label>
				<ShadePicker id="{side}Shade" options={family} selected={shade} size="sm" />
			</Field.Field>
		</Field.Group>
	</Field.Set>
{/snippet}

<svelte:head>
	<title>Compare | Tailwind CSS Color</title>
	<meta name="description" content="Compare Tailwind CSS colors across different versions" />
</svelte:head>

<section class="flex w-full grow flex-col gap-5 pt-6 pb-6 md:pt-8">
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">Compare</h1>
		<p class="text-sm text-muted-foreground">
			Put two shades side by side, from the same or different Tailwind versions.
		</p>
	</header>

	<div class="flex items-start gap-3 md:items-end md:gap-6">
		{@render controls("left", leftVersion, leftColorOptions, leftColor, leftChoice, leftShade)}
		<Button
			variant="outline"
			size="icon"
			class="mt-6 shrink-0 md:mt-0"
			aria-label="Swap left and right colors"
			onclick={() => {
				const tempVer = leftVersion.current;
				const tempColor = leftColor.current;
				const tempShade = leftShade.current;
				leftVersion.current = rightVersion.current;
				leftColor.current = rightColor.current;
				leftShade.current = rightShade.current;
				rightVersion.current = tempVer;
				rightColor.current = tempColor;
				rightShade.current = tempShade;
			}}
		>
			<ArrowLeftRight />
		</Button>
		{@render controls(
			"right",
			rightVersion,
			rightColorOptions,
			rightColor,
			rightChoice,
			rightShade,
		)}
	</div>

	<div
		class="flex min-h-64 grow flex-row overflow-hidden rounded-xl inset-ring inset-ring-black/10 md:min-h-80 dark:inset-ring-white/10"
	>
		{@render half(leftSelectedColor, leftVersion.current)}
		{@render half(rightSelectedColor, rightVersion.current)}
	</div>
</section>
