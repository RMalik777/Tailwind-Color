<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import Toolbar from "$lib/components/toolbar.svelte";

	import ColorPicker from "$lib/components/custom/color-picker.svelte";
	import ShadePicker from "$lib/components/custom/shade-picker.svelte";

	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
	import { PersistedState } from "runed";

	import { getColorsByVersion } from "$lib/data/color";
	import { interpolationOptions, versionOptions } from "$lib/const/option";
	import { findFamily, findShade } from "$lib/functions/color";
	import type { Version } from "$lib/types/color";

	const interpolation = new PersistedState("interpolation", "oklch");
	const version = new PersistedState<Version>("version", "V4");
	const degree = new PersistedState("degree", 90);
	const colorOptions = $derived(getColorsByVersion(version.current));

	const leftColor = new PersistedState("gradientLeftColor", "red");
	const leftChoice = $derived(findFamily(colorOptions, leftColor.current));
	const leftShade = new PersistedState("gradientLeftShade", "500");
	const leftSelectedColor = $derived(findShade(leftChoice?.range, leftShade.current));

	const rightColor = new PersistedState("gradientRightColor", "fuchsia");
	const rightChoice = $derived(findFamily(colorOptions, rightColor.current));
	const rightShade = new PersistedState("gradientRightShade", "500");
	const rightSelectedColor = $derived(findShade(rightChoice?.range, rightShade.current));

	const value = new PersistedState("gradientStops", [0, 100]);
</script>

<svelte:head>
	<title>Gradient | Tailwind CSS Color</title>
	<meta name="description" content="Compare and test gradient colors in Tailwind CSS" />
</svelte:head>

<section class="flex w-full grow flex-col justify-between gap-2 pb-(--toolbar-space) md:pb-2">
	<Toolbar>
		<div class="control flex flex-col gap-4">
			<h1
				class="hidden text-xl font-medium tracking-tight transition-name-[page-title] sm:pl-1 md:block"
			>
				Gradient
			</h1>
			<div class="flex flex-row items-end gap-4">
				<div class="space-y-1">
					<Label for="version" class="transition-name-[version-label]">Version</Label>
					<Select.Root type="single" bind:value={version.current}>
						<Select.Trigger
							id="version"
							class="w-full transition-name-[version-select]"
							placeholder="Select Version"
							size="sm"
						>
							{versionOptions.find((option) => option.value === version.current)?.name ??
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
					<Label for="interpolation">Interpolation</Label>
					<Select.Root type="single" bind:value={interpolation.current}>
						<Select.Trigger
							id="interpolation"
							class="w-full"
							placeholder="Select Version"
							size="sm"
						>
							{interpolationOptions.find((option) => option.value === interpolation.current)
								?.name ?? "Select Version"}
						</Select.Trigger>
						<Select.Content preventScroll={false}>
							<Select.Group>
								<Select.Label>Interpolation</Select.Label>
								{#each interpolationOptions as option (option.value)}
									{@const isDefault =
										(option.value === "oklab" && version.current === "V4") ||
										(option.value === "srgb" && version.current !== "V4")}
									<Select.Item value={option.value}>
										{option.name}<span class="text-muted-foreground">
											{isDefault ? " (Default)" : ""}
										</span>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-1">
					<Label for="degree">Degree</Label>
					<Input
						id="degree"
						type="number"
						placeholder="90"
						step="30"
						bind:value={degree.current}
						class="h-7 w-20 font-mono"
						oninput={(e) => {
							const value = parseInt(e.currentTarget.value);
							if (!isNaN(value)) {
								if (value > 360) {
									degree.current = 0;
								} else if (value < 0) {
									degree.current = 360;
								}
							}
						}}
					/>
				</div>
			</div>
			<div class="flex flex-row items-center gap-4 sm:items-end">
				<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="w-full grow space-y-1">
						<Label for="leftColor">Color</Label>
						<ColorPicker id="leftColor" options={colorOptions} selected={leftColor} size="sm" />
					</div>
					<div class="w-full grow space-y-1">
						<Label for="leftShade">Shade</Label>
						<ShadePicker id="leftShade" options={leftChoice} selected={leftShade} size="sm" />
					</div>
				</div>
				<Button
					variant="outline"
					size="icon"
					class="grow-0"
					onclick={() => {
						const tempColor = leftColor.current;
						const tempShade = leftShade.current;
						leftColor.current = rightColor.current;
						leftShade.current = rightShade.current;
						rightColor.current = tempColor;
						rightShade.current = tempShade;
					}}
				>
					<ArrowLeftRight class="w-fit min-w-fit" />
					<span class="sr-only">Swap left and right colors</span>
				</Button>
				<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="w-full grow space-y-1">
						<Label for="rightColor">Color</Label>
						<ColorPicker id="rightColor" options={colorOptions} selected={rightColor} size="sm" />
					</div>
					<div class="w-full grow space-y-1">
						<Label for="rightShade">Shade</Label>
						<ShadePicker id="rightShade" options={rightChoice} selected={rightShade} size="sm" />
					</div>
				</div>
			</div>
			<div class="space-y-1">
				<Slider type="multiple" bind:value={value.current} max={100} step={1} />
				<div class="relative h-5 font-mono text-sm text-muted-foreground">
					{#each value.current as stop, i (i)}
						<p
							class="absolute top-0 -translate-x-1/2 tabular-nums"
							style="left: clamp(1.25rem, {stop}%, calc(100% - 1.25rem));"
						>
							{stop}%
						</p>
					{/each}
				</div>
			</div>
		</div>
	</Toolbar>

	<div
		class="min-h-48 w-full grow rounded-lg transition duration-150 ease-linear transition-name-[color-preview]"
		style="
    --tw-gradient-from: {leftSelectedColor?.oklch.long};
    --tw-gradient-to: {rightSelectedColor?.oklch.long};
    --tw-gradient-from-position: {value.current[0]}%;
    --tw-gradient-to-position: {value.current[1]}%;
    --tw-gradient-position: {degree.current}deg in {interpolation.current};
		--tw-gradient-stops: var(
			--tw-gradient-via-stops,
			var(--tw-gradient-position),
			var(--tw-gradient-from) var(--tw-gradient-from-position),
			var(--tw-gradient-to) var(--tw-gradient-to-position)
		);
      background-image: linear-gradient(var(--tw-gradient-stops));"
	></div>
</section>

<style>
	@property --tw-gradient-position {
		syntax: "*";
		inherits: false;
	}
	@property --tw-gradient-from {
		syntax: "<color>";
		inherits: false;
		initial-value: #0000;
	}
	@property --tw-gradient-via {
		syntax: "<color>";
		inherits: false;
		initial-value: #0000;
	}
	@property --tw-gradient-to {
		syntax: "<color>";
		inherits: false;
		initial-value: #0000;
	}
	@property --tw-gradient-stops {
		syntax: "*";
		inherits: false;
	}
	@property --tw-gradient-via-stops {
		syntax: "*";
		inherits: false;
	}
	@property --tw-gradient-from-position {
		syntax: "<length-percentage>";
		inherits: false;
		initial-value: 0%;
	}
	@property --tw-gradient-via-position {
		syntax: "<length-percentage>";
		inherits: false;
		initial-value: 50%;
	}
	@property --tw-gradient-to-position {
		syntax: "<length-percentage>";
		inherits: false;
		initial-value: 100%;
	}
</style>
