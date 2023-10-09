<script lang="ts">
	import Icons, { icons } from "./Icons.svelte";
	import StickyModals from "./StickyModals.svelte";

	export let iconName;
	export let buttonText;
	let menuTarget;
	let isHover = false;
	let isOpen = false;
	let openTimeout;
	let closeTimeout;

	const openPropertyMenu = async () => {
		// console.log("enter");
		isHover = true;
		clearTimeout(closeTimeout);
		openTimeout = setTimeout(() => {
			// console.log("open");
			if (isHover) isOpen = true;
		}, 100);
		// console.log("end enter");
	};

	const closePropertyMenu = async () => {
		// console.log("leave");
		isHover = false;
		clearTimeout(openTimeout);
		closeTimeout = setTimeout(() => {
			// console.log("close");
			if (!isHover) isOpen = false;
		}, 100);
	};
</script>

<button
	class="flex"
	on:mouseenter={openPropertyMenu}
	on:mouseleave={closePropertyMenu}
>
	<div
		class="text-left hover:bg-[#363636] w-full flex p-1 rounded-md justify-between items-center h-7"
	>
		<div class="flex gap-2 items-center">
			<div class=" h-4 w-4">
				<Icons {iconName}></Icons>
			</div>
			<p>{buttonText}</p>
		</div>
		<div class="w-2"></div>
		<div class="h-4 w-4">
			<Icons iconName={icons.rightArrow}></Icons>
		</div>
		{#if isOpen}
			<StickyModals
				needToFlip={false}
				defaultLimits={true}
				yOffset={-8}
				xOffset={12}
				{menuTarget}
				bind:isActive={isOpen}
			>
				<slot />
			</StickyModals>
		{/if}
	</div>
	<div bind:this={menuTarget}></div>
</button>
