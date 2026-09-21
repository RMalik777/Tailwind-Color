<script lang="ts">
	const license = [
		{
			name: "Tailwind CSS",
			url: "https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE",
		},
		{
			name: "Culori",
			url: "https://github.com/Evercoder/culori/blob/main/LICENSE",
		},
		{
			name: "apca-w3",
			url: "https://github.com/Myndex/apca-w3/blob/master/LICENSE.md",
		},
	];
</script>

<svelte:head>
	<title>License</title>
	<meta name="description" content="License information for the Tailwind CSS Color Gallery." />
</svelte:head>

<div class="flex w-full max-w-2xl flex-col gap-8 pt-12 pb-4 sm:pt-16">
	<h1 class="text-4xl font-bold tracking-tight">License</h1>

	<section class="space-y-3">
		<h2 class="text-xl font-semibold tracking-tight">Third Party Code Used</h2>
		<ul class="space-y-1.5">
			{#each license as item (item.url)}
				<li>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
						>{item.name}</a
					>
				</li>
			{/each}
		</ul>
	</section>
</div>
