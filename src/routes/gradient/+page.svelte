<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import ColorPicker from "$lib/components/custom/color-picker.svelte";
	import ShadePicker from "$lib/components/custom/shade-picker.svelte";
	import VersionSelect from "$lib/components/custom/version-select.svelte";

	import ArrowUpDown from "@lucide/svelte/icons/arrow-up-down";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import Minus from "@lucide/svelte/icons/minus";
	import Plus from "@lucide/svelte/icons/plus";
	import { PersistedState } from "runed";

	import { interpolationOptions } from "$lib/const/option";
	import { getColorsByVersion } from "$lib/data/color";
	import { findFamily, findShade } from "$lib/functions/color";
	import { defaultInterpolation, gradientStyle } from "$lib/functions/gradient";
	import type { Gradient, GradientSyncKey, Version } from "$lib/types/color";

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
	const view = new PersistedState("gradientView", "preview");

	const MIN_GRADIENTS = 2;
	const MAX_GRADIENTS = 4;

	const gradients = new PersistedState<Gradient[]>("gradientCompareList", [
		{
			id: 1,
			version: "V4",
			fromColor: "red",
			fromShade: "500",
			toColor: "blue",
			toShade: "500",
			interpolation: defaultInterpolation("V4"),
			degree: 90,
			stops: [0, 100],
		},
		{
			id: 2,
			version: "V4",
			fromColor: "red",
			fromShade: "500",
			toColor: "blue",
			toShade: "500",
			interpolation: "srgb",
			degree: 90,
			stops: [0, 100],
		},
	]);

	const syncOptions: { key: GradientSyncKey; title: string }[] = [
		{ key: "version", title: "Version" },
		{ key: "from", title: "From color" },
		{ key: "to", title: "To color" },
		{ key: "interpolation", title: "Interpolation" },
		{ key: "degree", title: "Angle" },
		{ key: "stops", title: "Color stops" },
	];

	// Fields each synced setting covers. A color is synced together with its shade.
	const syncFields: Record<GradientSyncKey, (keyof Gradient)[]> = {
		version: ["version"],
		from: ["fromColor", "fromShade"],
		to: ["toColor", "toShade"],
		interpolation: ["interpolation"],
		degree: ["degree"],
		stops: ["stops"],
	};

	const synced = new PersistedState<Record<GradientSyncKey, boolean>>("gradientCompareSynced", {
		version: true,
		from: false,
		to: false,
		interpolation: false,
		degree: true,
		stops: true,
	});

	const syncedCount = $derived(syncOptions.filter((option) => synced.current[option.key]).length);

	/**
	 * Sets one field of a gradient. While the field is synced, only Gradient 1 can change it, and the change applies to every gradient.
	 * @param id - Gradient to change
	 * @param field - Field to change
	 * @param value - New value
	 */
	function setField<K extends keyof Gradient>(id: number, field: K, value: Gradient[K]) {
		const list = gradients.current;
		const isSynced = syncOptions.some(
			(option) => synced.current[option.key] === true && syncFields[option.key].includes(field),
		);
		if (isSynced) {
			if (list[0]?.id !== id) return;
			gradients.current = list.map((gradient) => ({ ...gradient, [field]: value }));
			return;
		}
		gradients.current = list.map((gradient) =>
			gradient.id === id ? { ...gradient, [field]: value } : gradient,
		);
	}

	/**
	 * Wraps one field of a gradient in a `current` accessor, so the pickers can read and write it.
	 * @param gradient - Gradient that holds the value
	 * @param field - Field to read and write
	 * @returns An object whose `current` reads `gradient[field]` and writes through `setField`
	 */
	function access<K extends keyof Gradient>(gradient: Gradient, field: K) {
		return {
			get current() {
				return gradient[field];
			},
			set current(value: Gradient[K]) {
				setField(gradient.id, field, value);
			},
		};
	}

	/**
	 * Whether a setting of a gradient follows Gradient 1 and can not be changed on its own.
	 * @param index - Position of the gradient in the list
	 * @param key - Setting to check
	 * @returns True for every gradient after the first while the setting is synced
	 */
	function isLocked(index: number, key: GradientSyncKey): boolean {
		return index > 0 && synced.current[key] === true;
	}
</script>

<svelte:head>
	<title>Gradient | Tailwind CSS Color</title>
	<meta name="description" content="Compare and test gradient colors in Tailwind CSS" />
</svelte:head>

<section class="flex w-full grow flex-col gap-5 pt-6 pb-6 md:pt-8">
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">Gradient</h1>
		<p class="text-sm text-muted-foreground">
			Blend two shades and see how each interpolation mode changes the result, or compare gradients
			across versions.
		</p>
	</header>

	<Tabs.Root class="grow gap-4" bind:value={view.current}>
		<Tabs.List class="w-full sm:max-w-xs">
			<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			<Tabs.Trigger value="compare">Compare</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="preview" class="flex">
			<div
				class="grid grow gap-6 md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]"
			>
				<Field.FieldGroup class="max-md:order-last">
					<Field.FieldGroup class="grid grid-cols-2">
						<Field.Field class="col-span-2">
							<Field.FieldLabel for="version">Version</Field.FieldLabel>
							<VersionSelect id="version" selected={version} size="sm" />
						</Field.Field>
						<Field.Field>
							<Field.FieldLabel for="interpolation">Interpolation</Field.FieldLabel>
							<Select.Root type="single" bind:value={interpolation.current}>
								<Select.Trigger id="interpolation" class="w-full" size="sm">
									{interpolationOptions.find((option) => option.value === interpolation.current)
										?.name ?? "Select interpolation"}
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
						</Field.Field>
						<Field.Field>
							<Field.FieldLabel for="degree">Angle</Field.FieldLabel>
							<InputGroup.Root class="h-7">
								<InputGroup.Input
									id="degree"
									type="number"
									placeholder="90"
									step="30"
									bind:value={degree.current}
									class="font-mono tabular-nums"
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
								<InputGroup.Addon align="inline-end">
									<InputGroup.Text class="text-xs">deg</InputGroup.Text>
								</InputGroup.Addon>
							</InputGroup.Root>
						</Field.Field>
					</Field.FieldGroup>

					<Field.FieldSeparator />

					<Field.FieldGroup>
						<Field.FieldSet>
							<Field.FieldLegend variant="label">Start color</Field.FieldLegend>
							<Field.FieldGroup class="grid grid-cols-2">
								<Field.Field>
									<Field.FieldLabel for="leftColor" class="text-xs text-muted-foreground"
										>Color</Field.FieldLabel
									>
									<ColorPicker
										id="leftColor"
										options={colorOptions}
										selected={leftColor}
										size="sm"
									/>
								</Field.Field>
								<Field.Field>
									<Field.FieldLabel for="leftShade" class="text-xs text-muted-foreground"
										>Shade</Field.FieldLabel
									>
									<ShadePicker id="leftShade" options={leftChoice} selected={leftShade} size="sm" />
								</Field.Field>
							</Field.FieldGroup>
						</Field.FieldSet>
						<div class="flex items-center gap-3">
							<span class="h-px grow bg-border"></span>
							<Button
								variant="outline"
								size="sm"
								onclick={() => {
									const tempColor = leftColor.current;
									const tempShade = leftShade.current;
									leftColor.current = rightColor.current;
									leftShade.current = rightShade.current;
									rightColor.current = tempColor;
									rightShade.current = tempShade;
								}}
							>
								<ArrowUpDown />
								Swap
							</Button>
							<span class="h-px grow bg-border"></span>
						</div>
						<Field.FieldSet>
							<Field.FieldLegend variant="label">End color</Field.FieldLegend>
							<Field.FieldGroup class="grid grid-cols-2">
								<Field.Field>
									<Field.FieldLabel for="rightColor" class="text-xs text-muted-foreground"
										>Color</Field.FieldLabel
									>
									<ColorPicker
										id="rightColor"
										options={colorOptions}
										selected={rightColor}
										size="sm"
									/>
								</Field.Field>
								<Field.Field>
									<Field.FieldLabel for="rightShade" class="text-xs text-muted-foreground"
										>Shade</Field.FieldLabel
									>
									<ShadePicker
										id="rightShade"
										options={rightChoice}
										selected={rightShade}
										size="sm"
									/>
								</Field.Field>
							</Field.FieldGroup>
						</Field.FieldSet>
					</Field.FieldGroup>

					<Field.FieldSeparator />

					<Field.Field class="gap-3">
						<Field.FieldTitle id="stops-label">Color stops</Field.FieldTitle>
						<Slider
							type="multiple"
							bind:value={value.current}
							max={100}
							step={1}
							aria-labelledby="stops-label"
						/>
						<div class="relative h-5 font-mono text-xs text-muted-foreground">
							{#each value.current as stop, i (i)}
								<p
									class="absolute top-0 -translate-x-1/2 tabular-nums"
									style="left: clamp(1.25rem, {stop}%, calc(100% - 1.25rem));"
								>
									{stop}%
								</p>
							{/each}
						</div>
					</Field.Field>
				</Field.FieldGroup>

				<div
					class="min-h-56 w-full rounded-xl inset-ring inset-ring-black/10 transition duration-150 ease-linear md:min-h-96 dark:inset-ring-white/10"
					style={gradientStyle(
						leftSelectedColor,
						rightSelectedColor,
						value.current,
						degree.current,
						interpolation.current,
					)}
				></div>
			</div>
		</Tabs.Content>

		<Tabs.Content value="compare" class="flex flex-col gap-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class={buttonVariants({ variant: "outline", size: "sm", className: "w-fit self-end" })}
				>
					Sync
					{#if syncedCount > 0}
						<Badge variant="secondary" class="h-4 min-w-4 px-1 font-mono">
							{syncedCount}
						</Badge>
					{/if}
					<ChevronDown />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-60" preventScroll={false}>
					<DropdownMenu.Group>
						<DropdownMenu.Label>
							Follow Gradient 1
							<p class="mt-0.5 text-xs font-normal text-muted-foreground">
								Checked settings copy Gradient 1 settings and are locked on the others.
							</p>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#each syncOptions as option (option.key)}
							<DropdownMenu.CheckboxItem
								checked={synced.current[option.key] === true}
								onCheckedChange={(checked) => {
									synced.current = { ...synced.current, [option.key]: checked };
									const first = gradients.current[0];
									if (!checked || !first) return;
									// Turning a setting on copies Gradient 1's value to the rest.
									const values = Object.fromEntries(
										syncFields[option.key].map((field) => [field, first[field]]),
									);
									gradients.current = gradients.current.map((gradient) => ({
										...gradient,
										...values,
									}));
								}}
								closeOnSelect={false}
							>
								{option.title}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#each gradients.current as gradient, i (gradient.id)}
				{@const options = getColorsByVersion(gradient.version)}
				{@const fromFamily = findFamily(options, gradient.fromColor)}
				{@const toFamily = findFamily(options, gradient.toColor)}
				<Card.Root size="sm" class="shadow-none">
					<Card.Content
						class="grid gap-4 md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]"
					>
						<Field.FieldSet class="gap-3">
							<Field.FieldLegend
								variant="label"
								class="flex h-6 w-full items-center justify-between gap-2"
							>
								Gradient {i + 1}
								<span class="flex items-center gap-1">
									<Button
										variant="ghost"
										size="xs"
										disabled={isLocked(i, "from") || isLocked(i, "to")}
										onclick={() => {
											const from = { fromColor: gradient.toColor, fromShade: gradient.toShade };
											const to = { toColor: gradient.fromColor, toShade: gradient.fromShade };
											// Swapping Gradient 1 also swaps the synced colors of the rest.
											gradients.current = gradients.current.map((item) => {
												if (item.id === gradient.id) return { ...item, ...from, ...to };
												if (i > 0) return item;
												return {
													...item,
													...(synced.current.from ? from : {}),
													...(synced.current.to ? to : {}),
												};
											});
										}}
									>
										<ArrowUpDown />
										Swap
									</Button>
									{#if gradients.current.length > MIN_GRADIENTS}
										<Button
											variant="ghost"
											size="icon-xs"
											class="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
											onclick={() =>
												(gradients.current = gradients.current.filter(
													(item) => item.id !== gradient.id,
												))}
										>
											<Minus />
											<span class="sr-only">Remove gradient {i + 1}</span>
										</Button>
									{/if}
								</span>
							</Field.FieldLegend>
							<div class="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
								<Field.Field
									class="col-span-3 grid grid-cols-subgrid items-center"
									data-disabled={isLocked(i, "version")}
								>
									<Field.FieldLabel
										for="version-{gradient.id}"
										class="text-xs text-muted-foreground"
									>
										Version
									</Field.FieldLabel>
									<VersionSelect
										id="version-{gradient.id}"
										selected={access(gradient, "version")}
										disabled={isLocked(i, "version")}
										size="sm"
										class="col-span-2"
									/>
								</Field.Field>
								<Field.Field
									class="col-span-3 grid grid-cols-subgrid items-center"
									data-disabled={isLocked(i, "from")}
								>
									<Field.FieldLabel for="from-{gradient.id}" class="text-xs text-muted-foreground">
										From
									</Field.FieldLabel>
									<ColorPicker
										id="from-{gradient.id}"
										{options}
										selected={access(gradient, "fromColor")}
										disabled={isLocked(i, "from")}
										size="sm"
									/>
									<Field.FieldLabel for="fromShade-{gradient.id}" class="sr-only">
										From shade
									</Field.FieldLabel>
									<ShadePicker
										id="fromShade-{gradient.id}"
										options={fromFamily}
										selected={access(gradient, "fromShade")}
										disabled={isLocked(i, "from")}
										size="sm"
									/>
								</Field.Field>
								<Field.Field
									class="col-span-3 grid grid-cols-subgrid items-center"
									data-disabled={isLocked(i, "to")}
								>
									<Field.FieldLabel for="to-{gradient.id}" class="text-xs text-muted-foreground">
										To
									</Field.FieldLabel>
									<ColorPicker
										id="to-{gradient.id}"
										{options}
										selected={access(gradient, "toColor")}
										disabled={isLocked(i, "to")}
										size="sm"
									/>
									<Field.FieldLabel for="toShade-{gradient.id}" class="sr-only">
										To shade
									</Field.FieldLabel>
									<ShadePicker
										id="toShade-{gradient.id}"
										options={toFamily}
										selected={access(gradient, "toShade")}
										disabled={isLocked(i, "to")}
										size="sm"
									/>
								</Field.Field>
								<Field.Field
									class="col-span-3 grid grid-cols-subgrid items-center"
									data-disabled={isLocked(i, "interpolation") && isLocked(i, "degree")}
								>
									<Field.FieldLabel
										for="interpolation-{gradient.id}"
										class="text-xs text-muted-foreground"
									>
										Blend
									</Field.FieldLabel>
									<Select.Root
										type="single"
										value={gradient.interpolation}
										onValueChange={(value) => setField(gradient.id, "interpolation", value)}
										disabled={isLocked(i, "interpolation")}
									>
										<Select.Trigger
											id="interpolation-{gradient.id}"
											class="w-full"
											size="sm"
											aria-label="Interpolation"
										>
											{interpolationOptions.find(
												(option) => option.value === gradient.interpolation,
											)?.name ?? "Select interpolation"}
										</Select.Trigger>
										<Select.Content preventScroll={false}>
											<Select.Group>
												<Select.Label>Interpolation</Select.Label>
												{#each interpolationOptions as option (option.value)}
													<Select.Item value={option.value}>
														{option.name}
														<span class="text-muted-foreground">
															{option.value === defaultInterpolation(gradient.version)
																? " (Default)"
																: ""}
														</span>
													</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
									<InputGroup.Root class="h-7">
										<InputGroup.Input
											type="number"
											placeholder="90"
											step="30"
											aria-label="Angle"
											disabled={isLocked(i, "degree")}
											bind:value={
												() => gradient.degree, (value) => setField(gradient.id, "degree", value)
											}
											class="font-mono tabular-nums"
											oninput={(e) => {
												const value = parseInt(e.currentTarget.value);
												if (!isNaN(value)) {
													if (value > 360) {
														setField(gradient.id, "degree", 0);
													} else if (value < 0) {
														setField(gradient.id, "degree", 360);
													}
												}
											}}
										/>
										<InputGroup.Addon align="inline-end">
											<InputGroup.Text class="text-xs">deg</InputGroup.Text>
										</InputGroup.Addon>
									</InputGroup.Root>
								</Field.Field>
								<Field.Field
									class="col-span-3 grid grid-cols-subgrid items-center"
									data-disabled={isLocked(i, "stops")}
								>
									<Field.FieldTitle
										id="stops-{gradient.id}"
										class="text-xs font-normal text-muted-foreground"
									>
										Stops
									</Field.FieldTitle>
									<div class="col-span-2 flex h-7 items-center gap-3">
										<Slider
											type="multiple"
											bind:value={
												() => gradient.stops, (value) => setField(gradient.id, "stops", value)
											}
											max={100}
											step={1}
											disabled={isLocked(i, "stops")}
											aria-labelledby="stops-{gradient.id}"
										/>
										<span
											class="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums"
										>
											{gradient.stops[0]}–{gradient.stops[1]}%
										</span>
									</div>
								</Field.Field>
							</div>
						</Field.FieldSet>

						<div
							class="relative min-h-28 w-full rounded-md border border-ring bg-origin-border transition duration-150 ease-out max-md:order-first"
							style={gradientStyle(
								findShade(fromFamily?.range, gradient.fromShade),
								findShade(toFamily?.range, gradient.toShade),
								gradient.stops,
								gradient.degree,
								gradient.interpolation,
							)}
						>
							<span
								class="absolute right-2 bottom-2 rounded-sm border border-border bg-background/90 px-1 py-0.5 font-mono text-xs text-muted-foreground backdrop-blur-sm"
							>
								{gradient.version} · {gradient.interpolation} · {gradient.degree}°
							</span>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}

			<Button
				variant="outline"
				size="sm"
				class="w-full md:w-72 lg:w-80"
				disabled={gradients.current.length >= MAX_GRADIENTS}
				onclick={() => {
					const list = gradients.current;
					const last = list.at(-1);
					if (!last) return;
					const id = Math.max(...list.map((gradient) => gradient.id)) + 1;
					gradients.current = [...list, { ...last, id }];
				}}
			>
				{#if gradients.current.length >= MAX_GRADIENTS}
					Up to {MAX_GRADIENTS} gradients
				{:else}
					<Plus />
					Add gradient
				{/if}
			</Button>
		</Tabs.Content>
	</Tabs.Root>
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
