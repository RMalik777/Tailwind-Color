<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	import { PersistedState } from "runed";
	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions } from "$lib/data/option";

	let leftVersion = new PersistedState("leftVersion", "V4");
	const leftColorOptions = $derived.by(() => {
		switch (leftVersion.current) {
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
	let leftColor = new PersistedState("leftColor", "red");
	const leftChoice = $derived(
		leftColorOptions.find((color) => color.color === leftColor.current)?.range,
	);
	let leftShade = new PersistedState("leftShade", "500");
	const leftSelectedColor = $derived(
		leftChoice?.find((color) => color.shade.toString() === leftShade.current),
	);

	let rightVersion = new PersistedState("rightVersion", "V4");
	const rightColorOptions = $derived.by(() => {
		switch (rightVersion.current) {
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
	let rightColor = new PersistedState("rightColor", "red");
	const rightChoice = $derived(
		rightColorOptions.find((color) => color.color === rightColor.current)?.range,
	);
	let rightShade = new PersistedState("rightShade", "500");
	const rightSelectedColor = $derived(
		rightChoice?.find((color) => color.shade.toString() === rightShade.current),
	);
</script>

<svelte:head>
	<title>Compare | Tailwind CSS Color</title>
	<meta name="description" content="Compare Tailwind CSS colors across different versions" />
</svelte:head>

<section class="flex w-full grow flex-col justify-between gap-2 pb-2">
	<div class="control flex flex-row items-center gap-2 sm:items-end md:gap-4">
		<div class="grid w-full grid-cols-1 items-end gap-2 sm:grid-cols-3 md:gap-4">
			<div class="space-y-1">
				<Label for="leftVersion">Tailwind CSS Version</Label>
				<Select.Root type="single" bind:value={leftVersion.current}>
					<Select.Trigger id="leftVersion" class="w-full" placeholder="Select Version">
						{versionOptions.find((option) => option.value === leftVersion.current)?.name ??
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
			<div class="space-y-1">
				<Label for="leftShade">Shade</Label>
				<Select.Root type="single" bind:value={leftShade.current}>
					<Select.Trigger id="leftShade" class="w-full capitalize" placeholder="Select Shade">
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
										{leftVersion.current === "V0"
											? option.name.replace(leftColor.current + "-", "")
											: option.shade}
									</Select.Item>
								{/each}
							{/if}
						</Select.Group>
					</Select.Content>
				</Select.Root>
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
				<Label for="rightVersion">Tailwind CSS Version</Label>
				<Select.Root type="single" bind:value={rightVersion.current}>
					<Select.Trigger id="rightVersion" class="w-full" placeholder="Select Version">
						{versionOptions.find((option) => option.value === rightVersion.current)?.name ??
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
			<div class="space-y-1">
				<Label for="rightShade">Shade</Label>
				<Select.Root type="single" bind:value={rightShade.current}>
					<Select.Trigger id="rightShade" class="w-full capitalize" placeholder="Select Shade">
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
										{rightVersion.current === "V0"
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

	<div class="flex grow flex-row items-center">
		<div
			class="h-svh w-full rounded-l-sm transition duration-200 ease-linear sm:h-full"
			style="background-color: {leftVersion.current === 'V4'
				? leftSelectedColor?.oklch.long
				: leftSelectedColor?.hex.long}"
		></div>

		<div
			class="h-svh w-full rounded-r-sm transition duration-200 ease-linear sm:h-full"
			style="background-color: {rightVersion.current === 'V4'
				? rightSelectedColor?.oklch.long
				: rightSelectedColor?.hex.long}"
		></div>
	</div>
</section>
