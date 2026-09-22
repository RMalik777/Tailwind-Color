<script lang="ts">
	import { untrack } from "svelte";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	import { PersistedState } from "runed";
	// @ts-expect-error - @types/apca-w3 is not updated yet, so fontLookupAPCA is not defined
	import { calcAPCA, fontLookupAPCA } from "apca-w3";

	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	import ColorPicker from "$lib/components/custom/color-picker.svelte";
	import ShadePicker from "$lib/components/custom/shade-picker.svelte";
	import VersionSelect from "$lib/components/custom/version-select.svelte";

	import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
	import BadgeCheck from "@lucide/svelte/icons/badge-check";
	import BadgeX from "@lucide/svelte/icons/badge-x";
	import CaseLower from "@lucide/svelte/icons/case-lower";
	import Check from "@lucide/svelte/icons/check";
	import EyeOff from "@lucide/svelte/icons/eye-off";
	import Minus from "@lucide/svelte/icons/minus";

	import { getColorsByVersion } from "$lib/data/color";
	import { findFamily, findShade } from "$lib/functions/color";
	import { ColorHistory } from "$lib/functions/color-history.svelte";
	import { contrastValue, hexToLinearRgb, relativeLuminance } from "$lib/functions/contrast";
	import type { ColorFamily, ColorShade, Version } from "$lib/types/color";

	type Side = {
		id: string;
		label: string;
		color: PersistedState<string>;
		shade: PersistedState<string>;
		family: ColorFamily | undefined;
		selected: ColorShade | undefined;
		history: ColorHistory;
	};

	const wcagChecks = [
		{ id: "small-aa", size: "Small text", level: "AA", ratio: 4.5 },
		{ id: "small-aaa", size: "Small text", level: "AAA", ratio: 7 },
		{ id: "large-aa", size: "Large text", level: "AA", ratio: 3 },
		{ id: "large-aaa", size: "Large text", level: "AAA", ratio: 4.5 },
	];

	/** Highest Lc the gauge draws, keeps the tick labels evenly spaced. */
	const apcaScaleMax = 105;
	const apcaLevels = [
		{ value: 90, name: "Preferred body text" },
		{ value: 75, name: "Minimum body text" },
		{ value: 60, name: "Minimum fluent text" },
		{ value: 45, name: "Minimum large text" },
		{ value: 30, name: "Minimum any text" },
		{ value: 15, name: "Invisibility point" },
	];

	const version = new PersistedState<Version>("version", "V4");
	const contrastType = new PersistedState<"wcag" | "apca">("contrastType", "apca");

	const color = $derived(getColorsByVersion(version.current));

	const bgColor = new PersistedState("bgColor", "white");
	const bgShade = new PersistedState("bgShade", "0");
	const bgChoice = $derived(findFamily(color, bgColor.current));
	const bgSelectedColor = $derived(findShade(bgChoice?.range, bgShade.current));
	const bgHistory = new ColorHistory();

	const textColor = new PersistedState("textColor", "black");
	const textShade = new PersistedState("textShade", "0");
	const textChoice = $derived(findFamily(color, textColor.current));
	const textSelectedColor = $derived(findShade(textChoice?.range, textShade.current));
	const textHistory = new ColorHistory();

	const contrastRatio = $derived.by(() => {
		if (!bgSelectedColor || !textSelectedColor) return 0;
		const bgColor = hexToLinearRgb(bgSelectedColor.hex.long ?? "");
		const bgLuminance = relativeLuminance(bgColor.r, bgColor.g, bgColor.b);
		const textColor = hexToLinearRgb(textSelectedColor.hex.long ?? "");
		const textLuminance = relativeLuminance(textColor.r, textColor.g, textColor.b);

		return contrastValue(bgLuminance, textLuminance);
	});
	const wcagPassed = $derived(wcagChecks.filter((check) => contrastRatio >= check.ratio).length);

	const Lc = $derived(
		Number(calcAPCA(textSelectedColor?.hex.long ?? "#FFF", bgSelectedColor?.hex.long ?? "#000", 1)),
	);
	const absoluteLc = $derived(Math.abs(Lc));
	const font = $derived.by(() => {
		const fontlist = fontLookupAPCA(Lc) as Array<number | string>;
		return fontlist.map((font, i) => {
			return { name: i * 100, value: font.toString() };
		});
	});

	// A version switch repaints every swatch, so the old entries no longer match
	// the palette on screen. Declared first so it runs before the pushes below.
	let lastVersion = version.current;
	$effect(() => {
		if (version.current === lastVersion) return;
		lastVersion = version.current;
		untrack(() => {
			bgHistory.clear();
			textHistory.clear();
		});
	});
	$effect(() => {
		const selected = bgSelectedColor;
		const entry = { color: bgColor.current, shade: bgShade.current };
		if (!selected) return;
		untrack(() => bgHistory.push({ ...entry, name: selected.name, css: selected.oklch.long }));
	});
	$effect(() => {
		const selected = textSelectedColor;
		const entry = { color: textColor.current, shade: textShade.current };
		if (!selected) return;
		untrack(() => textHistory.push({ ...entry, name: selected.name, css: selected.oklch.long }));
	});

	function swap() {
		const swapColor = bgColor.current;
		const swapShade = bgShade.current;
		bgColor.current = textColor.current;
		bgShade.current = textShade.current;
		textColor.current = swapColor;
		textShade.current = swapShade;
	}
</script>

<svelte:head>
	<title>Contrast Checker | Tailwind CSS Color</title>
	<meta name="description" content="Check the contrast between Tailwind CSS colors." />
</svelte:head>

{#snippet colorPicker(side: Side)}
	<Card.Root class="gap-4 shadow-none">
		<Card.Header>
			<Card.Title>{side.label}</Card.Title>
			<Card.Description class="font-mono">{side.selected?.hex.long ?? "—"}</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div
				class="flex h-20 items-end rounded-lg p-2 inset-ring inset-ring-black/10 transition duration-200 ease-out sm:h-24 dark:inset-ring-white/10"
				style="background-color: {side.selected?.hex.long ?? 'transparent'};"
			>
				<span
					class="rounded-sm border border-border bg-background/90 px-1.5 py-0.5 font-mono text-xs font-medium text-foreground capitalize backdrop-blur-sm"
				>
					{side.selected?.name ?? "No color selected"}
				</span>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1">
					<Label for="{side.id}Color">Color</Label>
					<ColorPicker id="{side.id}Color" options={color} selected={side.color} />
				</div>
				<div class="space-y-1">
					<Label for="{side.id}Shade">Shade</Label>
					<ShadePicker id="{side.id}Shade" options={side.family} selected={side.shade} />
				</div>
			</div>
		</Card.Content>
		<Card.Footer>
			<div class="space-y-1.5">
				<p class="text-xs text-muted-foreground">Recent</p>
				{#if side.history.items.length === 0}
					<p class="text-xs text-muted-foreground">Colors you pick show up here.</p>
				{:else}
					<div class="flex flex-wrap gap-1.5">
						{#each side.history.items as item (item.color + "-" + item.shade)}
							{@const active =
								item.color === side.color.current && item.shade === side.shade.current}
							<div
								in:fade={{ duration: 150, easing: cubicOut }}
								animate:flip={{ duration: 200, easing: cubicOut }}
							>
								<Tooltip.Root>
									<Tooltip.Trigger
										aria-label="Use {item.name}"
										aria-current={active}
										class="block size-6 rounded-md inset-ring inset-ring-black/10 ring-offset-2 ring-offset-card transition duration-200 ease-out aria-current:ring-2 aria-current:ring-foreground dark:inset-ring-white/10"
										style="background-color: {item.css};"
										onclick={() => {
											side.color.current = item.color;
											side.shade.current = item.shade;
										}}
									></Tooltip.Trigger>
									<Tooltip.Content side="bottom">
										<p class="capitalize">{item.name}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Card.Footer>
	</Card.Root>
{/snippet}

<div class="flex w-full grow flex-col gap-6 pt-6 pb-6 md:pt-8">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold tracking-tight">Contrast</h1>
			<p class="text-sm text-muted-foreground">
				Check whether text stays readable on a background, with WCAG 2 and APCA.
			</p>
		</div>
		<div class="space-y-1.5 sm:w-40">
			<Label for="version">Version</Label>
			<VersionSelect id="version" selected={version} size="sm" />
		</div>
	</header>

	<div class="grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
		{@render colorPicker({
			id: "bg",
			label: "Background",
			color: bgColor,
			shade: bgShade,
			family: bgChoice,
			selected: bgSelectedColor,
			history: bgHistory,
		})}

		<div class="flex items-center justify-center">
			<Button
				variant="outline"
				class="w-full gap-2 sm:size-9 sm:w-9 sm:p-0"
				aria-label="Swap background and text color"
				onclick={swap}
			>
				<ArrowLeftRight class="size-4 shrink-0" />
				<span class="sm:hidden">Swap colors</span>
			</Button>
		</div>

		{@render colorPicker({
			id: "text",
			label: "Text",
			color: textColor,
			shade: textShade,
			family: textChoice,
			selected: textSelectedColor,
			history: textHistory,
		})}
	</div>

	<Tabs.Root class="w-full gap-2" bind:value={contrastType.current}>
		<Tabs.List class="w-full sm:max-w-xs">
			<Tabs.Trigger value="wcag">WCAG 2</Tabs.Trigger>
			<Tabs.Trigger value="apca">APCA</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="wcag">
			<div
				class="grid gap-4 rounded-xl border p-4 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center sm:gap-6 sm:p-6"
			>
				<div class="flex flex-col items-center gap-2 text-center">
					<p
						class="font-mono text-5xl font-black tracking-tight tabular-nums transition duration-200 ease-out lg:text-6xl"
					>
						{contrastRatio.toFixed(2)}<span class="text-2xl font-normal text-muted-foreground"
							>:1</span
						>
					</p>
					<p class="text-xs text-muted-foreground">Contrast ratio, from 1:1 to 21:1</p>
					<Badge
						variant={wcagPassed === wcagChecks.length
							? "default"
							: wcagPassed === 0
								? "destructive"
								: "outline"}
						class="tabular-nums"
					>
						{wcagPassed} of {wcagChecks.length} checks pass
					</Badge>
				</div>
				<div class="space-y-2">
					<div class="grid gap-2 sm:grid-cols-2">
						{#each wcagChecks as check (check.id)}
							{@const passed = contrastRatio >= check.ratio}
							<div
								class="flex items-center gap-2.5 rounded-md border px-3 py-2.5 transition duration-200 ease-out {passed
									? 'border-green-600/30 bg-green-50 text-green-950 dark:border-green-500/25 dark:bg-green-950/60 dark:text-green-50'
									: 'border-red-600/30 bg-red-50 text-red-950 dark:border-red-500/25 dark:bg-red-950/60 dark:text-red-50'}"
							>
								{#if passed}
									<BadgeCheck class="size-5 shrink-0" />
								{:else}
									<BadgeX class="size-5 shrink-0" />
								{/if}
								<div class="min-w-0">
									<p class="text-sm leading-tight font-medium">
										{check.level}
										{check.size.toLowerCase()}
									</p>
									<p class="font-mono text-xs opacity-70">needs {check.ratio} : 1</p>
								</div>
								<span class="ml-auto text-xs font-semibold">
									{passed ? "Pass" : "Fail"}
								</span>
							</div>
						{/each}
					</div>
					<p class="text-xs text-muted-foreground">
						Large text means 24px and up, or 18.66px and up when bold.
					</p>
				</div>
			</div>
		</Tabs.Content>

		<Tabs.Content value="apca">
			<div class="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
				<div class="flex flex-col gap-4">
					<div class="flex flex-col items-center gap-2 text-center">
						<p
							class="font-mono text-5xl font-black tracking-tight tabular-nums transition duration-200 ease-out lg:text-6xl"
						>
							<span class="text-2xl font-normal text-muted-foreground">L<sup>c</sup></span>
							{Lc}
						</p>
						<p class="text-xs text-muted-foreground">
							A minus sign means the background is the darker color.
						</p>
						{#if absoluteLc <= 15}
							<Badge variant="destructive" class="font-sans"><EyeOff />Contrast too low</Badge>
						{:else if absoluteLc <= 30}
							<Badge variant="outline" class="font-sans"><CaseLower />Certain non-text only</Badge>
						{:else if absoluteLc < 45}
							<Badge variant="outline" class="font-sans"><CaseLower />Non-content text only</Badge>
						{:else}
							<Badge variant="outline" class="font-sans"><Check />Usable for text</Badge>
						{/if}
					</div>

					<div class="space-y-1">
						<Progress
							value={Math.min(absoluteLc, apcaScaleMax)}
							max={apcaScaleMax}
							aria-label="APCA contrast"
							class="h-2.5 *:data-[slot=progress-indicator]:rounded-full *:data-[slot=progress-indicator]:bg-foreground *:data-[slot=progress-indicator]:duration-300 *:data-[slot=progress-indicator]:ease-out"
						/>
						<div class="flex justify-between font-mono text-[10px] text-muted-foreground">
							<span>0</span><span>15</span><span>30</span><span>45</span><span>60</span><span
								>75</span
							><span>90</span><span>105</span>
						</div>
					</div>

					<div class="grid gap-x-4 gap-y-1">
						{#each apcaLevels as level (level.value)}
							{@const reached = absoluteLc >= level.value}
							<div
								class="flex items-center gap-2 text-xs transition duration-200 {reached
									? 'text-foreground'
									: 'text-muted-foreground/60'}"
							>
								{#if reached}
									<Check class="size-3.5 shrink-0" />
								{:else}
									<Minus class="size-3.5 shrink-0" />
								{/if}
								<span class="w-14 shrink-0 font-mono">L<sup>c</sup> {level.value}</span>
								<span class="truncate">{level.name}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<div>
						<p class="text-sm font-medium">Minimum text size</p>
						<p class="text-xs text-muted-foreground">
							Smallest size this pairing supports, per font weight.
						</p>
					</div>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Weight</Table.Head>
								<Table.Head>Minimum size <span class="text-muted-foreground">(px)</span></Table.Head
								>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each font as { name, value } (name)}
								{#if name !== 0}
									<Table.Row>
										<Table.Cell class="py-1.5 font-medium tabular-nums">{name}</Table.Cell>
										<Table.Cell class="py-1.5 font-mono">
											{#if value === "999"}
												<Badge variant="destructive" class="font-sans">
													<EyeOff />Contrast too low
												</Badge>
											{:else if value === "777"}
												<Badge variant="outline" class="font-sans">Non-text only</Badge>
											{:else if value === "666"}
												<Badge variant="outline" class="font-sans">
													Spot text (copyright or placeholder)
												</Badge>
											{:else}
												<p class="py-px">{value}</p>
											{/if}
										</Table.Cell>
									</Table.Row>
								{/if}
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>

	<div class="overflow-hidden rounded-xl border">
		<div class="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
			<p class="text-sm font-medium">Preview</p>
			<p class="font-mono text-xs text-muted-foreground">
				<span class="capitalize">{textSelectedColor?.name ?? "—"}</span>
				on
				<span class="capitalize">{bgSelectedColor?.name ?? "—"}</span>
			</p>
		</div>

		<div
			class="space-y-4 p-4 transition duration-200 ease-out sm:p-6"
			style="background-color: {bgSelectedColor?.hex.long ?? '#ffffff'}; color: {textSelectedColor
				?.hex.long ?? '#000000'};"
		>
			<div class="space-y-1">
				<p class="text-xs font-medium opacity-60">Heading, 24px</p>
				<p class="max-w-[70ch] text-2xl">
					<span class="font-extralight">Lorem ipsum dolor sit</span>
					<span class="font-normal">amet consectetur adipisicing elit.</span>
					<span class="font-medium">In, mollitia vero? Laborum possimus sed suscipit vero.</span>
					<span class="font-bold">Harum fugit perferendis quasi.</span>
				</p>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium opacity-60">Body, 16px</p>
				<p class="max-w-[70ch] text-base">
					<span class="font-extralight">Lorem ipsum dolor sit</span>
					<span class="font-light">amet consectetur adipisicing elit.</span>
					<span class="font-normal">In, mollitia vero? Laborum possimus sed</span>
					<span class="font-medium">suscipit vero quibusdam voluptatem animi voluptatum!</span>
					<span class="font-semibold">Possimus sit expedita commodi accusantium,</span>
					<span class="font-bold">harum fugit perferendis quasi? Tempore!</span>
				</p>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium opacity-60">Caption, 12px</p>
				<p class="max-w-[70ch] text-xs">
					<span class="font-extralight">Lorem ipsum dolor sit</span>
					<span class="font-light">amet consectetur adipisicing elit.</span>
					<span class="font-normal">In, mollitia vero? Laborum possimus sed</span>
					<span class="font-medium">suscipit vero quibusdam voluptatem animi voluptatum!</span>
					<span class="font-semibold">Possimus sit expedita commodi accusantium,</span>
					<span class="font-bold">harum fugit perferendis quasi? Tempore!</span>
				</p>
			</div>
		</div>
	</div>

	<div class="space-y-2">
		<p class="text-sm font-medium">References</p>
		<ul class="grid gap-1 text-sm sm:grid-cols-2">
			<li>
				<a
					href="https://git.apcacontrast.com/documentation/WhyAPCA"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
				>
					Why APCA?
				</a>
			</li>
			<li>
				<a
					href="https://git.apcacontrast.com/documentation/APCAeasyIntro.html"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
				>
					The Easy Intro to the APCA Contrast Method
				</a>
			</li>
			<li>
				<a
					href="https://git.myndex.com/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
				>
					All Myndex Research content, including APCA
				</a>
			</li>
			<li>
				<a
					href="https://github.com/Myndex/SAPC-APCA/discussions"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
				>
					SAPC-APCA discussions
				</a>
			</li>
		</ul>
	</div>
</div>
