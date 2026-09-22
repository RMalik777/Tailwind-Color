<script lang="ts">
	const section = [
		{
			name: "Explore",
			items: [
				{
					name: "License",
					url: "/license",
					blank: false,
				},
			],
		},
		{
			name: "Color data source",
			items: [
				{
					name: "Tailwind CSS 4",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/1b16411919457ee47d38910fd07e134e9765eb4c/packages/tailwindcss/theme.css",
					blank: true,
				},
				{
					name: "Tailwind CSS 3",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/89f0f54751639db11affc4f60592002ef14c7ed6/src/public/colors.js",
					blank: true,
				},
				{
					name: "Tailwind CSS 2",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/ee87fed11376b2d23778ca2cb8ea99108416a734/colors.js",
					blank: true,
				},
				{
					name: "Tailwind CSS 1",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/8f3dbfe7a8be54c2afff46492dbf884c461ffa97/stubs/defaultConfig.stub.js",
					blank: true,
				},
				{
					name: "Tailwind CSS 0",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/66e4d1b3192e8013df336c7dff61f561243bd423/defaultConfig.stub.js",
					blank: true,
				},
			],
		},
		{
			name: "Other works",
			items: [
				{
					name: "Font Calculator",
					url: "https://font.raflimalik.com",
					blank: true,
				},
			],
		},
	];
</script>

<footer
	class="mt-16 border-t px-4 pt-10 pb-[calc(var(--toolbar-space,0px)+1.5rem)] text-sm sm:px-6 md:pb-8 lg:px-8"
>
	<div class="flex flex-col gap-8 md:flex-row md:justify-between">
		<div class="space-y-1">
			<p class="font-semibold tracking-tight">Tailwind Color</p>
			<p class="max-w-xs text-muted-foreground">
				Every Tailwind CSS color from v0 to v4, ready to compare and copy.
			</p>
		</div>
		<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
			{#each section as item (item.name)}
				<section class="space-y-2.5">
					<h2 class="font-medium">{item.name}</h2>
					<ul class="space-y-1.5">
						{#each item.items as subItem (subItem.url)}
							<li>
								<a
									href={subItem.url}
									target={subItem.blank ? "_blank" : ""}
									rel={subItem.blank ? "noopener noreferrer" : ""}
									class="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground"
									>{subItem.name}</a
								>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</div>
	<div
		class="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-6 text-muted-foreground"
	>
		<a
			href="http://raflimalik.com"
			target="_blank"
			rel="noopener noreferrer"
			class="underline-offset-4 hover:text-foreground hover:underline focus-visible:text-foreground"
		>
			&copy; {new Date().getFullYear()} Rafli Malik
		</a>
		<a
			href="https://github.com/RMalik777/Tailwind-Color"
			target="_blank"
			class="underline-offset-4 hover:text-foreground hover:underline focus-visible:text-foreground"
			>Source code</a
		>
	</div>
</footer>
