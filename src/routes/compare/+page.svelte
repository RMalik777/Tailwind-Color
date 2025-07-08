<script lang="ts">
	import { browser } from "$app/environment";

	import { colorV4, colorV3, colorV2, colorV1, colorV0 } from "$lib/data/color";

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

	let leftVersion = $state(browser ? localStorage.getItem("leftVersion") : "");
	const leftColorOptions = $derived.by(() => {
		switch (leftVersion) {
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
	let leftColor = $state(browser ? localStorage.getItem("leftColor") : "");
	const leftChoice = $derived(leftColorOptions.find((color) => color.color === leftColor)?.range);
	let leftShade = $state(browser ? localStorage.getItem("leftShade") : "");
	const leftSelectedColor = $derived(
		leftChoice?.find((color) => color.shade.toString() === leftShade),
	);

	let rightVersion = $state(browser ? localStorage.getItem("rightVersion") : "");
	const rightColorOptions = $derived.by(() => {
		switch (rightVersion) {
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
	let rightColor = $state(browser ? localStorage.getItem("rightColor") : "");
	const rightChoice = $derived(
		rightColorOptions.find((color) => color.color === rightColor)?.range,
	);
	let rightShade = $state(browser ? localStorage.getItem("rightShade") : "");
	const rightSelectedColor = $derived(
		rightChoice?.find((color) => color.shade.toString() === rightShade),
	);
</script>

<svelte:head>
	<title>Compare | Tailwind CSS Color</title>
	<meta name="description" content="Compare Tailwind CSS colors across different versions" />
</svelte:head>

<main class="mx-2 h-dvh pt-16 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10">
	<section
		class="flex h-full w-full flex-row justify-between *:flex *:h-full *:w-full *:flex-col *:items-center *:justify-center"
	>
		<div class="left">
			<div class="flex w-full flex-row justify-start gap-4">
				<div>
					<label for="leftVersion">Tailwind CSS Version</label>
					<select
						name="leftVersion"
						id="leftVersion"
						placeholder="Version"
						class="rounded border border-neutral-500/50 bg-white p-1"
						bind:value={leftVersion}
						onchange={() => localStorage.setItem("leftVersion", leftVersion ?? "")}
					>
						{#each versionOptions as option (option.value)}
							<option value={option.value}>{option.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="leftColor">Color</label>
					<select
						name="leftColor"
						id="leftColor"
						class="rounded border border-neutral-500/50 bg-white p-1 capitalize"
						bind:value={leftColor}
						onchange={() => localStorage.setItem("leftColor", leftColor ?? "")}
					>
						{#each leftColorOptions as option (option.color)}
							<option value={option.color} class="capitalize">{option.color}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="leftShade">Shade</label>
					<select
						name="leftShade"
						id="leftShade"
						class="rounded border border-neutral-500/50 bg-white p-1 capitalize"
						bind:value={leftShade}
						onchange={() => localStorage.setItem("leftShade", leftShade ?? "")}
					>
						{#if leftChoice}
							{#each leftChoice as option (option.shade)}
								<option value={option.shade.toString()} class="capitalize"
									>{leftVersion === "V0"
										? option.name.replace(leftColor + "-", "")
										: option.shade}</option
								>
							{/each}
						{/if}
					</select>
				</div>
			</div>
			<div
				class="h-full w-full"
				style="background-color: {leftVersion === 'V4'
					? leftSelectedColor?.oklch.long
					: leftSelectedColor?.hex.long}"
			></div>
		</div>

		<div class="right">
			<div class="flex w-full flex-row justify-start gap-4">
				<div>
					<label for="rightVersion">Tailwind CSS Version</label>
					<select
						name="rightVersion"
						id="rightVersion"
						class="rounded border border-neutral-500/50 bg-white p-1"
						bind:value={rightVersion}
						onchange={() => localStorage.setItem("rightVersion", rightVersion ?? "")}
					>
						{#each versionOptions as option (option.value)}
							<option value={option.value.toString()}>{option.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="rightColor">Color</label>
					<select
						name="rightColor"
						id="rightColor"
						class="rounded border border-neutral-500/50 bg-white p-1 capitalize"
						bind:value={rightColor}
						onclick={() => localStorage.setItem("rightColor", rightColor ?? "")}
					>
						{#each rightColorOptions as option (option.color)}
							<option value={option.color} class="capitalize">{option.color}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="rightShade">Shade</label>
					<select
						name="rightShade"
						id="rightShade"
						class="rounded border border-neutral-500/50 bg-white p-1 capitalize"
						bind:value={rightShade}
						onclick={() => localStorage.setItem("rightShade", rightShade ?? "")}
					>
						{#if rightChoice}
							{#each rightChoice as option (option.shade)}
								<option value={option.shade.toString()} class="capitalize"
									>{rightVersion === "V0"
										? option.name.replace(rightColor + "-", "")
										: option.shade}</option
								>
							{/each}
						{/if}
					</select>
				</div>
			</div>
			<div
				class="h-full w-full"
				style="background-color: {rightVersion === 'V4'
					? rightSelectedColor?.oklch.long
					: rightSelectedColor?.hex.long}"
			></div>
		</div>
	</section>
</main>
