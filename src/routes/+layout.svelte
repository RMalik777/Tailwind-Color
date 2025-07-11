<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/jetbrains-mono";
	import "../app.css";
	import { Toaster } from "svelte-sonner";
	import { ModeWatcher } from "mode-watcher";

	import Footer from "$lib/components/footer.svelte";
	import Nav from "$lib/components/nav.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>Tailwind CSS Color</title>
	<meta name="description" content="A website showing all available Tailwind CSS color" />
</svelte:head>

<ModeWatcher />
<Nav />
<main class="flex h-fit min-h-dvh px-2 pt-16 sm:px-4 md:px-6 lg:px-8 xl:px-10">
	{@render children()}
</main>
<Footer />
<Toaster />
