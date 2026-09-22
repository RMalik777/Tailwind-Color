<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { resetMode, setMode } from "mode-watcher";
	import { siGithub } from "simple-icons";

	import MenuIcon from "@lucide/svelte/icons/menu";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SunIcon from "@lucide/svelte/icons/sun";
	import XIcon from "@lucide/svelte/icons/x";

	import { link } from "$lib/const/nav";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	let open = $state(false);
	const isActive = (url: string) =>
		url === "/" ? page.url.pathname === url : page.url.pathname.startsWith(url);
	const current = $derived(link.find((item) => isActive(item.url)));

	/** Violet ramp for the logo mark, light to dark. */
	const mark = ["#c4b4ff", "#8e51ff", "#7008e7", "#4d179a"];
</script>

{#snippet actions(close: boolean)}
	<Button
		variant="ghost"
		size="icon"
		class="[&_svg]:size-4 [&_svg]:fill-current"
		href="https://github.com/RMalik777/Tailwind-Color"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Source code on GitHub"
		onclick={() => close && (open = false)}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html siGithub.svg}
	</Button>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
			<SunIcon class="size-4 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
			<MoonIcon
				class="absolute size-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item
				onclick={() => {
					setMode("light");
					if (close) open = false;
				}}>Light</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => {
					setMode("dark");
					if (close) open = false;
				}}>Dark</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => {
					resetMode();
					if (close) open = false;
				}}>System</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}

<svelte:window onresize={() => (open = false)} />
<header class="fixed inset-x-0 top-0 z-50 border-b bg-background">
	<nav class="flex h-14 items-center gap-6 px-4 sm:px-6 lg:px-8">
		<a
			href={resolve("/")}
			class="flex min-w-0 shrink-0 items-center gap-2.5 rounded-md font-semibold tracking-tight"
		>
			<span
				class="grid size-5 shrink-0 grid-cols-2 overflow-hidden rounded-[5px]"
				aria-hidden="true"
			>
				{#each mark as color (color)}
					<span style="background-color: {color}"></span>
				{/each}
			</span>
			<span>Tailwind Color</span>
		</a>
		{#if current && current.url !== "/"}
			<span class="-ml-3 truncate text-muted-foreground sm:hidden">/ {current.name}</span>
		{/if}

		<ul class="hidden h-full items-stretch gap-1 sm:flex">
			{#each link as item (item.url)}
				<li class="flex">
					<a
						href={resolve(item.url)}
						aria-current={isActive(item.url) ? "page" : undefined}
						class="relative flex items-center px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary"
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>

		<div class="ml-auto hidden items-center gap-1 sm:flex">
			{@render actions(false)}
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="ml-auto sm:hidden"
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			{#if open}
				<XIcon class="size-5" />
			{:else}
				<MenuIcon class="size-5" />
			{/if}
			<span class="sr-only">Toggle navigation</span>
		</Button>
	</nav>

	<div
		class="grid transition-[grid-template-rows] duration-300 ease-out sm:hidden {open
			? 'grid-rows-[1fr]'
			: 'invisible grid-rows-[0fr]'}"
	>
		<div class="overflow-hidden">
			<ul class="flex flex-col border-t px-2 py-2">
				{#each link as item (item.url)}
					<li>
						<a
							href={resolve(item.url)}
							onclick={() => (open = false)}
							aria-current={isActive(item.url) ? "page" : undefined}
							class="flex items-center justify-between rounded-md px-2 py-2.5 text-base text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
						>
							{item.name}
							{#if isActive(item.url)}
								<span class="size-1.5 rounded-full bg-primary"></span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
			<div class="flex items-center justify-end gap-1 border-t px-2 py-2">
				{@render actions(true)}
			</div>
		</div>
	</div>
</header>
