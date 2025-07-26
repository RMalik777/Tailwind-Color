<script lang="ts">
	import { PersistedState } from "runed";

	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";

	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
	import BadgeCheck from "@lucide/svelte/icons/badge-check";
	import BadgeX from "@lucide/svelte/icons/badge-x";

	import { colorV0, colorV1, colorV2, colorV3, colorV4 } from "$lib/data/color";
	import { versionOptions } from "$lib/data/option";
	import { contrastValue, processColorFromHex, relativeLuminance } from "$lib/functions/contrast";

	const minContrastSmall = 4.5;
	const minContrastLarge = 3;
	const enhContrastSmall = 7;
	const enhContrastLarge = 4.5;
	const contrastOptions = [
		{
			name: "Small",
			value: [
				{ name: "Minimum", number: minContrastSmall },
				{ name: "Enhanced", number: enhContrastSmall },
			],
		},
		{
			name: "Large",
			value: [
				{ name: "Minimum", number: minContrastLarge },
				{ name: "Enhanced", number: enhContrastLarge },
			],
		},
	];
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
	const bgColorOptions = $derived(color);
	const bgColor = new PersistedState("bgColor", "white");
	const bgChoice = $derived(bgColorOptions.find((color) => color.color === bgColor.current)?.range);
	const bgShade = new PersistedState("bgShade", "50");
	const bgSelectedColor = $derived(
		bgChoice?.find((color) => color.shade.toString() === bgShade.current),
	);

	const textColorOptions = $derived(color);
	const textColor = new PersistedState("textColor", "black");
	const textChoice = $derived(
		textColorOptions.find((color) => color.color === textColor.current)?.range,
	);
	const textShade = new PersistedState("textShade", "900");
	const textSelectedColor = $derived(
		textChoice?.find((color) => color.shade.toString() === textShade.current),
	);

	const contrastRatio = $derived.by(() => {
		if (!bgSelectedColor || !textSelectedColor) return 0;
		const bgColor = processColorFromHex(bgSelectedColor.hex.long ?? "");
		const bgLuminance = relativeLuminance(bgColor.r, bgColor.g, bgColor.b);
		const textColor = processColorFromHex(textSelectedColor.hex.long ?? "");
		const textLuminance = relativeLuminance(textColor.r, textColor.g, textColor.b);

		return contrastValue(bgLuminance, textLuminance);
	});
</script>

<svelte:head>
	<title>Contrast Checker | Tailwind CSS Color</title>
	<meta name="description" content="Check the contrast between Tailwind CSS colors." />
</svelte:head>

<div class="flex w-full grow flex-col gap-4 pb-1">
	<div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
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
	</div>

	<div class="control flex flex-row items-end gap-2 md:gap-4">
		<div class="grid w-full grid-cols-1 items-end gap-2 sm:grid-cols-2 md:gap-4">
			<div class="col-span-2">
				<p class="font-semibold tracking-tight">Background</p>
				<Separator />
			</div>
			<div class="space-y-1">
				<Label for="leftColor">Color</Label>
				<Select.Root
					type="single"
					bind:value={bgColor.current}
					onValueChange={(value) => {
						if (value === "black" || value === "white") bgShade.current = "0";
						else if (bgShade.current === "0") bgShade.current = "50";
					}}
				>
					<Select.Trigger id="leftColor" class="w-full capitalize" placeholder="Select Color">
						{bgColorOptions.find((option) => option.color === bgColor.current)?.color ??
							"Select Color"}
					</Select.Trigger>
					<Select.Content preventScroll>
						<Select.Group>
							<Select.Label>Color</Select.Label>
							{#each bgColorOptions as option (option.color)}
								<Select.Item value={option.color} class="capitalize">{option.color}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-1">
				<Label for="leftShade">Shade</Label>
				<Select.Root type="single" bind:value={bgShade.current} disabled={!bgColor}>
					<Select.Trigger id="leftShade" class="w-full capitalize" placeholder="Select Shade">
						{bgChoice
							?.find((option) => option.shade.toString() === bgShade.current)
							?.name.replace(bgColor.current + "-", "") ?? "Select Shade"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Shade</Select.Label>
							{#if bgChoice}
								{#each bgChoice as option (option.shade)}
									<Select.Item value={option.shade.toString()} class="capitalize">
										{version.current === "V0"
											? option.name.replace(bgColor.current + "-", "")
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
				const tempColor = bgColor.current;
				const tempShade = bgShade.current;
				bgColor.current = textColor.current;
				bgShade.current = textShade.current;
				textColor.current = tempColor;
				textShade.current = tempShade;
			}}
		>
			<ArrowLeftRight class="w-fit min-w-fit" />
		</Button>

		<div class="grid w-full grid-cols-1 items-end gap-2 sm:grid-cols-2 md:gap-4">
			<div class="col-span-2">
				<p class="font-semibold tracking-tight">Text</p>
				<Separator />
			</div>
			<div class="space-y-1">
				<Label for="textColor">Color</Label>
				<Select.Root
					type="single"
					bind:value={textColor.current}
					onValueChange={(value) => {
						if ((value === "black" || value === "white") && textShade.current !== "0")
							textShade.current = "0";
						else if (textShade.current === "0") textShade.current = "50";
					}}
				>
					<Select.Trigger id="textColor" class="w-full capitalize" placeholder="Select Color">
						{textColorOptions.find((option) => option.color === textColor.current)?.color ??
							"Select Color"}
					</Select.Trigger>
					<Select.Content preventScroll>
						<Select.Group>
							<Select.Label>Color</Select.Label>
							{#each textColorOptions as option (option.color)}
								<Select.Item value={option.color} class="capitalize">{option.color}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-1">
				<Label for="rightShade">Shade</Label>
				<Select.Root type="single" bind:value={textShade.current} disabled={!textColor}>
					<Select.Trigger id="rightShade" class="w-full capitalize" placeholder="Select Shade">
						{textChoice
							?.find((option) => option.shade.toString() === textShade.current)
							?.name.replace(textColor.current + "-", "") ?? "Select Shade"}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Shade</Select.Label>
							{#if textChoice}
								{#each textChoice as option (option.shade)}
									<Select.Item value={option.shade.toString()} class="capitalize">
										{version.current === "V0"
											? option.name.replace(textColor.current + "-", "")
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

	<div class="space-y-2">
		<div
			class="grid grid-cols-1 items-center gap-0 overflow-clip rounded-lg border tracking-tight max-sm:gap-y-2 max-sm:pt-4 sm:grid-cols-2"
		>
			<p
				class="row-span-2 flex flex-col text-center font-mono text-3xl font-black tracking-tight transition duration-200 ease-out sm:text-4xl lg:text-5xl xl:text-6xl
        {contrastRatio >= minContrastSmall
					? 'text-green-500 dark:text-green-400'
					: 'text-red-500 dark:text-red-400'}"
			>
				{contrastRatio}
				<span class="text-xs font-normal tracking-normal text-muted-foreground">Contrast Ratio</span
				>
			</p>
			<div class="">
				{#each contrastOptions as { name, value } (name)}
					<div class="grid grid-cols-2 gap-x-2 p-2">
						<p class="col-span-2 text-base font-semibold">{name} Text</p>
						{#each value as { name: valueName, number } (valueName)}
							<div
								class="flex items-center gap-2 rounded-sm px-2.5 py-2 font-medium transition duration-200 {contrastRatio >=
								number
									? 'bg-green-100/80 text-green-900  dark:bg-green-950/80 dark:text-green-50'
									: 'bg-red-100/80 text-red-900  dark:bg-red-950/80 dark:text-red-50'}"
							>
								{#if contrastRatio >= number}
									<BadgeCheck class="size-5" />
								{:else}
									<BadgeX class="size-5" />
								{/if}
								<p class="flex flex-col gap-0 text-sm/4">
									{valueName}
									<span class="font-mono text-xs font-bold text-muted-foreground">
										{number} : 1
									</span>
								</p>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div
			class="rounded-lg border p-4 transition duration-200 ease-out"
			style="background-color: {bgSelectedColor?.hex.long ?? '#ffffff'}; color: {textSelectedColor
				?.hex.long ?? '#000000'};"
		>
			<div class="space-y-1 font-normal">
				<p class="text-2xl">
					<span class="font-extralight">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.</span
					>
					<span class="font-normal">
						In, mollitia vero? Laborum possimus sed suscipit vero quibusdam voluptatem animi
						voluptatum!
					</span>
					<span class="font-bold">
						Possimus sit expedita commodi accusantium, harum fugit perferendis quasi? Tempore!.</span
					>
				</p>
				<p class="text-base">
					<span class="font-extralight">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.</span
					>
					<span class="font-normal">
						In, mollitia vero? Laborum possimus sed suscipit vero quibusdam voluptatem animi
						voluptatum!
					</span>
					<span class="font-bold">
						Possimus sit expedita commodi accusantium, harum fugit perferendis quasi? Tempore!.</span
					>
				</p>
				<p class="text-xs">
					<span class="font-extralight">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.</span
					>
					<span class="font-normal">
						In, mollitia vero? Laborum possimus sed suscipit vero quibusdam voluptatem animi
						voluptatum!
					</span>
					<span class="font-bold">
						Possimus sit expedita commodi accusantium, harum fugit perferendis quasi? Tempore!.</span
					>
				</p>
			</div>
		</div>
	</div>
</div>
