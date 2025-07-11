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

<div class="flex flex-col">
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
						class="text-blue-500 hover:text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-500"
						>{item.name}</a
					>
				</li>
			{/each}
		</ul>
	</section>
</div>
