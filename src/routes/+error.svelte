<script lang="ts">
	import { page } from "$app/state";

	import { Button } from "$lib/components/ui/button/index";
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";

	import img404 from "$lib/assets/404-NotFound.png?enhanced";
	import img500 from "$lib/assets/500-InternalServerError.png?enhanced";
	import img503 from "$lib/assets/503-ServiceUnavailable.png?enhanced";
	const img = $derived.by(() => {
		if (page.status === 404) return img404;
		if (page.status === 500) return img500;
		if (page.status === 503) return img503;
	});
</script>

<svelte:head>
	<title>{page.status} | {page.error?.message}</title>
</svelte:head>

<div class="h-svh w-full sm:-mt-16">
	<div class="flex h-full w-full flex-col items-center justify-start gap-4 sm:justify-center">
		{#if img}
			<div class="mx-auto max-h-2/3 sm:max-h-1/2">
				<enhanced:img src={img} alt="" class="h-auto max-h-full w-auto" />
			</div>
		{/if}
		<div class="space-y-1 text-center tracking-tight">
			<h1 class="text-6xl font-bold tracking-tighter tabular-nums sm:text-7xl lg:text-8xl">
				{page.status}
			</h1>
			<p class="text-3xl font-medium">
				{page.error?.message}
			</p>
		</div>
		<Button href="/" variant="outline">
			<ArrowLeft />
			Back to Home
		</Button>
	</div>
	{#if img}
		<p class="self-end text-sm text-muted-foreground">
			Logo by: <a
				href="https://github.com/SAWARATSUKI/KawaiiLogos"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-400 underline transition duration-150 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-600"
			>
				Sawaratsuki</a
			>
		</p>
	{/if}
</div>
