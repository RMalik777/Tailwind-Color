<script lang="ts">
	const link = [
		{
			name: "Home",
			url: "/",
		},
		{
			name: "Compare",
			url: "/compare",
		},
	];
</script>

<nav class="flex w-full items-center px-4 py-2 sm:px-6 lg:px-8 xl:px-10">
	<ul class="*:font-lg flex gap-2">
		{#each link as item (item.url)}
			<li class="font-semibold tracking-tight">
				<a
					href={item.url}
					class="rounded px-2 py-1 duration-200 ease-out hover:bg-violet-500/10 hover:text-violet-500 focus-visible:bg-violet-500/10 focus-visible:text-violet-500"
					>{item.name}
				</a>
			</li>
		{/each}
	</ul>
</nav>
