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
	];
</script>

<main class="flex min-h-dvh flex-col px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
	<h1 class="py-20 text-4xl font-bold tracking-tight">License</h1>

	<section>
		<h2 class="text-2xl font-bold">Third Party Code Used</h2>
		<ul>
			{#each license as item (item.url)}
				<li>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-500 hover:text-blue-600 hover:underline">{item.name}</a
					>
				</li>
			{/each}
		</ul>
	</section>
</main>
