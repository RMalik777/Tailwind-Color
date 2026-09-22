<script lang="ts">
	import ExternalLink from "@lucide/svelte/icons/external-link";

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

<div class="flex w-full max-w-2xl flex-col gap-8 pt-10 pb-4 sm:pt-16">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">License</h1>
		<p class="text-muted-foreground">
			This site is built on the work below. Each link opens the project's license.
		</p>
	</header>

	<section class="space-y-3">
		<h2 class="text-sm font-medium text-muted-foreground">Third-party code</h2>
		<ul class="divide-y rounded-xl border">
			{#each license as item (item.url)}
				<li>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60"
					>
						<span class="font-medium">{item.name}</span>
						<ExternalLink class="size-4 text-muted-foreground" />
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>
