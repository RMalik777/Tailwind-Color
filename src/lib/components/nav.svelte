<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { resetMode, setMode } from "mode-watcher";
	import { siGithub } from "simple-icons";

	import MenuIcon from "@lucide/svelte/icons/menu";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SunIcon from "@lucide/svelte/icons/sun";

	import { link } from "$lib/const/nav";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

	let open = $state(false);
</script>

<svelte:window onresize={() => (open = false)} />
<nav
	class="fixed z-50 flex h-fit w-full flex-row-reverse items-center justify-between border-b px-4 py-2 shadow-xs sm:flex-row sm:px-6 lg:px-8 xl:px-10"
>
	<div
		class="absolute top-0 left-0 -z-1 h-full w-full bg-background sm:bg-background/90 sm:backdrop-blur-lg"
	></div>
	<Button variant="outline" size="icon" class="sm:hidden" onclick={() => (open = !open)}>
		<MenuIcon class="size-5" />
		<span class="sr-only">Toggle navigation</span>
	</Button>

	<div
		class="top-12.5 h-full gap-2 transition-all duration-300 ease-in-out max-sm:fixed max-sm:flex max-sm:flex-col max-sm:space-y-1 max-sm:overflow-hidden max-sm:rounded-b-md max-sm:border max-sm:bg-background max-sm:px-8 max-sm:py-4 sm:flex sm:gap-2 md:gap-4
    {open ? 'right-0 max-sm:w-full' : '-right-full max-sm:invisible max-sm:w-fit'}"
	>
		{#each link as item (item.url)}
			{@const isActive =
				item.url === "/" ? page.url.pathname === item.url : page.url.pathname.startsWith(item.url)}
			<a
				href={resolve(item.url)}
				onclick={() => (open = false)}
				aria-current={isActive ? "page" : undefined}
				class="relative overflow-hidden rounded-sm p-2 text-base font-semibold tracking-tight transition-all duration-200 ease-out after:absolute after:inset-0 after:h-full after:w-full after:rounded-sm after:transition-all after:duration-200 after:ease-out after:content-[''] hover:bg-violet-500/10 hover:text-violet-500 focus-visible:bg-violet-500/10 focus-visible:text-violet-500 aria-[current=page]:after:bg-linear-90 aria-[current=page]:after:from-violet-500/10 aria-[current=page]:after:to-purple-500/10 aria-[current=page]:after:text-violet-500 aria-[current=page]:after:transition-name-[indicator] max-sm:text-right sm:px-4 sm:py-1 sm:text-lg dark:hover:bg-violet-500/20 dark:hover:text-violet-400 aria-[current=page]:dark:after:bg-violet-500/20 aria-[current=page]:dark:after:text-violet-400"
			>
				{item.name}
			</a>
		{/each}
	</div>
	<div class="hidden items-center justify-end space-x-1 sm:flex">
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</nav>
