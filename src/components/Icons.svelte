<script lang="ts" context="module">
	export const icons = {
		inspect: "inspect",
		paragraph: "paragraph",
		tags: "tags",
		rightArrow: "rightArrow",
		header: "header",
	} as const;
</script>

<script lang="ts">
	export let iconName;
	export let width = 24;
	export let height = 24;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={`${width}`}
	height={`${height}`}
	viewBox={`0 0 ${width} ${height}`}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="lucide lucide-menu w-full h-full"
>
	{#if iconName == icons.inspect}
		<path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
		<path d="m12 12 4 10 1.7-4.3L22 16Z" />
	{:else if iconName == icons.paragraph}
		<line x1="4" x2="20" y1="12" y2="12" />
		<line x1="4" x2="20" y1="6" y2="6" />
		<line x1="4" x2="20" y1="18" y2="18" />
	{:else if iconName == icons.tags}
		<path
			d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"
		/>
		<path d="M6 9.01V9" />
		<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
	{:else if iconName == icons.rightArrow}
		<path d="m9 18 6-6-6-6" />
	{:else if iconName == icons.header}
		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
		<line x1="3" x2="21" y1="9" y2="9" />
	{/if}
</svg>
