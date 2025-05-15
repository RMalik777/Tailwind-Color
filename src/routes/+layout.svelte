<script lang="ts">
	import "@fontsource-variable/inter";
	import "@fontsource-variable/jetbrains-mono";
	import "../app.css";
	import { Toaster } from "svelte-sonner";

	let { children } = $props();
</script>

<svelte:head>
	<title>TailwindCSS Color</title>
	<meta name="description" content="A website showing all available TailwindCSS color" />
</svelte:head>

{@render children()}
<Toaster />
