<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/jetbrains-mono";
	import "../app.css";
	import { Toaster } from "svelte-sonner";

	import Footer from "$lib/components/footer.svelte";
	import Nav from "$lib/components/nav.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>TailwindCSS Color</title>
	<meta name="description" content="A website showing all available TailwindCSS color" />
</svelte:head>

<Nav />
{@render children()}
<Footer />
<Toaster />
