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
			name: "Color Data Source",
			items: [
				{
					name: "Tailwind CSS 4",
					url: "https://github.com/tailwindlabs/tailwindcss/blob/c7d368b3c42de46e44b17c71d3bf9a9c6b3bc5cb/packages/tailwindcss/theme.css",
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
	];
</script>

<footer class="mt-12 flex w-full flex-col border-t border-neutral-500/50 tracking-tight">
	<div
		class="mx-2 flex flex-col items-start justify-start gap-2 pt-6 sm:mx-4 sm:flex-row sm:gap-10 md:mx-6 md:gap-12 lg:mx-8 lg:gap-16 xl:mx-10 xl:gap-20"
	>
		{#each section as item (item.name)}
			<section class="flex flex-col gap-2 pt-4">
				<h2 class="text-xl font-semibold">{item.name}</h2>
				<ul class="flex flex-col gap-1">
					{#each item.items as subItem (subItem.url)}
						<li>
							<a
								href={subItem.url}
								target={subItem.blank ? "_blank" : ""}
								rel={subItem.blank ? "noopener noreferrer" : ""}
								class="duration-200 hover:text-purple-600 hover:underline focus-visible:text-purple-600 focus-visible:underline"
								>{subItem.name}</a
							>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
	<a
		href="http://raflimalik.com"
		target="_blank"
		rel="noopener noreferrer"
		class="mt-4 self-center text-sm text-neutral-500 hover:text-neutral-600 hover:underline focus-visible:text-neutral-600 focus-visible:underline"
	>
		&copy; 2025 Rafli Malik
	</a>
	<a
		href="https://github.com/RMalik777/Tailwind-Color"
		target="_blank"
		class="self-center text-sm text-neutral-500 hover:text-neutral-600 hover:underline focus-visible:text-neutral-600 focus-visible:underline"
		>Source Code</a
	>
</footer>
