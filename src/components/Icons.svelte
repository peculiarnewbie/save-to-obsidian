<script lang="ts" context="module">
	export const icons = {
		inspect: "inspect",
		paragraph: "paragraph",
		tags: "tags",
		rightArrow: "rightArrow",
		header: "header",
		url: "url",
		date: "date",
		image: "image",
		bin: "bin",
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
	{:else if iconName == icons.url}
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
	{:else if iconName == icons.date}
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
		<line x1="16" x2="16" y1="2" y2="6" />
		<line x1="8" x2="8" y1="2" y2="6" />
		<line x1="3" x2="21" y1="10" y2="10" />
	{:else if iconName == icons.image}
		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
		<circle cx="9" cy="9" r="2" />
		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
	{:else if iconName == icons.bin}
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		<line x1="10" x2="10" y1="11" y2="17" />
		<line x1="14" x2="14" y1="11" y2="17" />
	{/if}
</svg>
