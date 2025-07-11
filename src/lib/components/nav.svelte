<script lang="ts">
	import { page } from "$app/state";
	import { siGithub } from "simple-icons";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";

	import { resetMode, setMode } from "mode-watcher";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants, Button } from "$lib/components/ui/button/index.js";

	const link = [
		{
			name: "Home",
			url: "/",
		},
		{
			name: "Compare",
			url: "/compare",
		},
		{
			name: "Gradient",
			url: "/gradient",
		},
		{
			name: "Gallery",
			url: "/gallery",
		},
	];
</script>

<nav
	class="fixed z-50 flex h-fit w-full items-center justify-between border-b bg-background/80 px-4 py-2 shadow-xs backdrop-blur-md sm:px-6 lg:px-8 xl:px-10"
>
	<ul class="flex gap-2 sm:gap-4">
		{#each link as item (item.url)}
			<li class="text-lg font-semibold tracking-tight">
				<a
					href={item.url}
					class="rounded px-2 py-1 duration-200 ease-out hover:bg-violet-500/10 hover:text-violet-500 focus-visible:bg-violet-500/10 focus-visible:text-violet-500 sm:px-4 dark:hover:bg-violet-500/20 dark:hover:text-violet-400
          {page.url.pathname === item.url
						? 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20 dark:text-violet-400'
						: ''}"
				>
					{item.name}
				</a>
			</li>
		{/each}
	</ul>
	<div class="space-x-1">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Button
			variant="ghost"
			size="icon"
			class="dark:fill-white"
			href="https://github.com/RMalik777/Tailwind-Color"
			target="_blank"
			rel="noopener noreferrer"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html siGithub.svg}
		</Button>
	</div>
</nav>
