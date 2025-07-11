<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";

	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
	import { PersistedState } from "runed";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { interpolationOptions, versionOptions } from "$lib/data/option";

	const interpolation = new PersistedState("interpolation", "oklch");
	const version = new PersistedState("version", "V4");
	const leftColorOptions = $derived.by(() => {
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
	let leftColor = new PersistedState("gradientLeftColor", "red");
	const leftChoice = $derived(
		leftColorOptions.find((color) => color.color === leftColor.current)?.range,
	);
	let leftShade = new PersistedState("gradientLeftShade", "500");
	const leftSelectedColor = $derived(
		leftChoice?.find((color) => color.shade.toString() === leftShade.current),
	);

	const rightColorOptions = $derived.by(() => {
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
	let rightColor = new PersistedState("gradientRightColor", "fuchsia");
	const rightChoice = $derived(
		rightColorOptions.find((color) => color.color === rightColor.current)?.range,
	);
	let rightShade = new PersistedState("gradientRightShade", "500");
	const rightSelectedColor = $derived(
		rightChoice?.find((color) => color.shade.toString() === rightShade.current),
	);
</script>

<svelte:head>
	<title>Compare | Tailwind CSS Color</title>
	<meta name="description" content="Compare Tailwind CSS colors across different versions" />
</svelte:head>

<section class="flex w-full grow flex-col justify-between gap-2 pb-2">
	<div class="control flex flex-col gap-4">
		<div class="flex flex-row items-end gap-4">
			<div class="space-y-1">
				<Label for="leftVersion">Tailwind CSS Version</Label>
				<Select.Root type="single" bind:value={version.current}>
					<Select.Trigger id="leftVersion" class="w-full" placeholder="Select Version">
						{versionOptions.find((option) => option.value === version.current)?.name ??
							"Select Version"}
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
			<div class="space-y-1">
				<Label for="leftVersion">Interpolation Method</Label>
				<Select.Root type="single" bind:value={interpolation.current}>
					<Select.Trigger id="leftVersion" class="w-full" placeholder="Select Version">
						{interpolationOptions.find((option) => option.value === interpolation.current)?.name ??
							"Select Version"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Interpolation</Select.Label>
							{#each interpolationOptions as option (option.value)}
								<Select.Item value={option.value}>{option.name}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div class="flex flex-row items-end gap-4">
			<div class="w-full grow space-y-1">
				<Label for="leftColor">Color</Label>
				<Select.Root type="single" bind:value={leftColor.current}>
					<Select.Trigger id="leftColor" class="w-full capitalize" placeholder="Select Color">
						{leftColorOptions.find((option) => option.color === leftColor.current)?.color ??
							"Select Color"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Color</Select.Label>
							{#each leftColorOptions as option (option.color)}
								<Select.Item value={option.color} class="capitalize">{option.color}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="w-full grow space-y-1">
				<Label for="leftShade">Shade</Label>
				<Select.Root type="single" bind:value={leftShade.current}>
					<Select.Trigger
						id="leftShade"
						class="w-full capitalize"
						placeholder="Select Shade"
						disabled={!leftChoice}
					>
						{leftChoice
							?.find((option) => option.shade.toString() === leftShade.current)
							?.name.replace(leftColor.current + "-", "") ?? "Select Shade"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Shade</Select.Label>
							{#if leftChoice}
								{#each leftChoice as option (option.shade)}
									<Select.Item value={option.shade.toString()} class="capitalize">
										{version.current === "V0"
											? option.name.replace(leftColor.current + "-", "")
											: option.shade}
									</Select.Item>
								{/each}
							{/if}
						</Select.Group>
					</Select.Content>
				</Select.Root>
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
			</Button>
			<div class="w-full grow space-y-1">
				<Label for="rightColor">Color</Label>
				<Select.Root type="single" bind:value={rightColor.current}>
					<Select.Trigger id="rightColor" class="w-full capitalize" placeholder="Select Color">
						{rightColorOptions.find((option) => option.color === rightColor.current)?.color ??
							"Select Color"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Color</Select.Label>
							{#each rightColorOptions as option (option.color)}
								<Select.Item value={option.color} class="capitalize">{option.color}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="w-full grow space-y-1">
				<Label for="rightShade">Shade</Label>
				<Select.Root type="single" bind:value={rightShade.current}>
					<Select.Trigger
						id="rightShade"
						class="w-full capitalize"
						placeholder="Select Shade"
						disabled={!rightChoice}
					>
						{rightChoice
							?.find((option) => option.shade.toString() === rightShade.current)
							?.name.replace(rightColor.current + "-", "") ?? "Select Shade"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Shade</Select.Label>
							{#if rightChoice}
								{#each rightChoice as option (option.shade)}
									<Select.Item value={option.shade.toString()} class="capitalize">
										{version.current === "V0"
											? option.name.replace(rightColor.current + "-", "")
											: option.shade}
									</Select.Item>
								{/each}
							{/if}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>

	<div
		class="col-span-2 h-dvh w-full rounded-sm transition-colors duration-200 ease-linear sm:h-full"
		style="
    --tw-gradient-from: {leftSelectedColor?.oklch.long};
    --tw-gradient-to: {rightSelectedColor?.oklch.long};
    --tw-gradient-position: 90deg in {interpolation.current};
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
