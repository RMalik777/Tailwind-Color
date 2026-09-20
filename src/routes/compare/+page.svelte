<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";

	import ColorPicker from "$lib/components/custom/color-picker.svelte";
	import ShadePicker from "$lib/components/custom/shade-picker.svelte";

	import { PersistedState } from "runed";
	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";

	import { getColorsByVersion } from "$lib/data/color";
	import { versionOptions } from "$lib/const/option";
	import { findFamily, findShade } from "$lib/functions/color";
	import type { Version } from "$lib/types/color";

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

<svelte:head>
	<title>Compare | Tailwind CSS Color</title>
	<meta name="description" content="Compare Tailwind CSS colors across different versions" />
</svelte:head>

<section class="flex w-full grow flex-col justify-between gap-2 pb-2">
	<Toolbar className="flex-col items-stretch">
		<h1
			class="hidden text-xl font-medium tracking-tight transition-name-[page-title] sm:pl-1 md:block md:grow"
		>
			Compare
		</h1>
		<div class="control flex flex-row items-center gap-2 sm:items-end md:gap-4">
			<div class="grid w-full grid-cols-1 items-end gap-2 sm:grid-cols-3 md:gap-4">
				<div class="space-y-1">
					<Label for="leftVersion">Version</Label>
					<Select.Root type="single" bind:value={leftVersion.current}>
						<Select.Trigger id="leftVersion" class="w-full" placeholder="Select Version" size="sm">
							{versionOptions.find((option) => option.value === leftVersion.current)?.name ??
								"Select Version"}
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
				<div class="space-y-1">
					<Label for="leftColor">Color</Label>
					<ColorPicker id="leftColor" options={leftColorOptions} selected={leftColor} size="sm" />
				</div>
				<div class="space-y-1">
					<Label for="leftShade">Shade</Label>
					<ShadePicker id="leftShade" options={leftChoice} selected={leftShade} size="sm" />
				</div>
			</div>
			<Button
				variant="outline"
				size="icon"
				class=""
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
				<ArrowLeftRight class="w-fit min-w-fit" />
			</Button>
			<div class="grid w-full grid-cols-1 items-end gap-2 sm:grid-cols-3 md:gap-4">
				<div class="space-y-1">
					<Label for="rightVersion" class="transition-name-[version-label]">Version</Label>
					<Select.Root type="single" bind:value={rightVersion.current}>
						<Select.Trigger
							id="rightVersion"
							class="w-full transition-name-[version-select]"
							placeholder="Select Version"
							size="sm"
						>
							{versionOptions.find((option) => option.value === rightVersion.current)?.name ??
								"Select Version"}
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
				<div class="space-y-1">
					<Label for="rightColor">Color</Label>
					<ColorPicker
						id="rightColor"
						options={rightColorOptions}
						selected={rightColor}
						size="sm"
					/>
				</div>
				<div class="space-y-1">
					<Label for="rightShade">Shade</Label>
					<ShadePicker id="rightShade" options={rightChoice} selected={rightShade} size="sm" />
				</div>
			</div>
		</div>
	</Toolbar>

	<div
		class="flex grow flex-row items-center overflow-hidden rounded-lg border border-border transition-name-[color-preview]"
	>
		<div
			class="h-svh w-full rounded-l-lg transition duration-200 ease-linear sm:h-full"
			style="background-color: {leftVersion.current === 'V4'
				? leftSelectedColor?.oklch.long
				: leftSelectedColor?.hex.long}"
		></div>

		<div
			class="h-svh w-full rounded-r-lg transition duration-200 ease-linear sm:h-full"
			style="background-color: {rightVersion.current === 'V4'
				? rightSelectedColor?.oklch.long
				: rightSelectedColor?.hex.long}"
		></div>
	</div>
</section>
