<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/jetbrains-mono";
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { ModeWatcher } from "mode-watcher";

	import Footer from "$lib/components/footer.svelte";
	import Nav from "$lib/components/nav.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>Tailwind CSS Color</title>
	<meta
		name="description"
		content="Check out all available Tailwind CSS colors across different versions, from v0 to v4. Compare the old color and gradient with the new one."
	/>
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="#8e0dff" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#8e0dff" />
	<meta
		property="og:description"
		content="Check out all available Tailwind CSS colors across different versions, from v0 to v4. Compare the old color and gradient with the new one."
	/>
	<meta property="og:url" content="https://www.raflimalik.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Rafli Malik" />
</svelte:head>

<ModeWatcher />
<Nav />
<main class="flex h-fit min-h-dvh px-2 pt-16 sm:px-4 md:px-6 lg:px-8 xl:px-10">
	{@render children()}
</main>
<Footer />
<Toaster />
