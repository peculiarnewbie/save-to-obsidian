<script lang="ts">
	import { onMount, tick } from "svelte";
	import { mainIframeDoc } from "../utils/stores";

	export let reOrderField: (index: number, offset: number) => void;
	export let index: number;
	export let length: number;
	export let startingIndex = 0;

	export let dragElement: HTMLElement | null;
	export let isBeingDragged = false;

	export let reorderCleanup: () => void;

	let isMouseDown = false;
	let xDrag = 0;
	let yDrag = 0;
	let xDragInit = 0;
	let yDragInit = 0;

	let xInitParentRef = 0;
	let yInitParentRef = 0;
	let xParentRef = 0;
	let yParentRef = 0;

	$: xParent = xInitParentRef - xParentRef;
	$: yParent = yInitParentRef - yParentRef;

	let thisElement: HTMLElement;
	let parentElement: HTMLElement;

	/**
	 * hack, somehow mouseup event don't propagate if it was reordered up at least once
	 */
	let wasReordered = false;

	$: elementHeight = thisElement?.getBoundingClientRect().height;

	const handleStartDragging = (e: MouseEvent) => {
		xDragInit = e.clientX;
		yDragInit = e.clientY;
		isMouseDown = true;
		console.log("mousedown");
		//@ts-ignore
		$mainIframeDoc.addEventListener("mousemove", handleDragging);
		//@ts-ignore
		$mainIframeDoc.addEventListener("mouseup", handleStopDragging);
		updateParent(true);
	};

	const handleStopDragging = (e: MouseEvent) => {
		stopDragging(e);

		if (wasReordered) {
			wasReordered = false;
			isBeingDragged = false;
		}
	};

	const stopDragging = (e?: MouseEvent) => {
		xDrag = 0;
		yDrag = 0;
		//@ts-ignore
		$mainIframeDoc.removeEventListener("mousemove", handleDragging);
		//@ts-ignore
		$mainIframeDoc.removeEventListener("mouseup", handleStopDragging);
		isMouseDown = false;
		if (reorderCleanup) reorderCleanup();
	};

	const handleDragging = (e: MouseEvent) => {
		if (!isMouseDown) return;
		// e.preventDefault()
		// console.log(e.target);
		// console.log("x: ", xDragInit, xDrag, "y: ", yDragInit, yDrag)
		xDrag = xDragInit - e.clientX - xParent;
		yDrag = yDragInit - e.clientY - yParent;
		if (xDrag > 10 || xDrag < -10 || yDrag > 10 || yDrag < -10)
			isBeingDragged = true;
		if (isBeingDragged) {
			if (e.clientY < yParentRef && index != startingIndex) {
				wasReordered = true;
				reorder(-1);
			}
			if (
				e.clientY > yParentRef + elementHeight &&
				index != length - startingIndex
			) {
				reorder(1);
			}
		}
	};

	const updateParent = (init: boolean) => {
		const rect = parentElement.getBoundingClientRect();
		if (init) {
			xInitParentRef = rect.x;
			yInitParentRef = rect.y;
		}
		xParentRef = rect.x;
		yParentRef = rect.y;
	};

	const reorder = async (offset: number) => {
		// console.log("reordering index: ", index, "offset: ", offset);
		reOrderField(index, offset);
		await tick();
		if (offset > 0) yDrag += elementHeight;
		else yDrag -= elementHeight;
		updateParent(false);
	};

	$: {
		if (dragElement) {
			dragElement.addEventListener("mousedown", handleStartDragging);
		}
	}

	onMount(() => {
		console.log("ello");
	});
</script>

<div bind:this={parentElement} class="relative">
	<div
		bind:this={thisElement}
		class={`${isBeingDragged ? "absolute w-full" : "relative"}`}
		style={`will-change:transform; transform: translate3d(${
			isBeingDragged ? `${-xDrag}px, ${-yDrag}px` : "0px, 0px"
		}, 0px); ${isBeingDragged ? "z-index: 999999;" : ""}`}
	>
		<slot />
	</div>
</div>
<!-- <p>reorderable {index}</p> -->
{#if isBeingDragged}
	<div class="p-[1px] w-full rounded-md" style={`height: ${elementHeight}px`}>
		<div class="w-full h-full bg-[#3f355d] rounded-md"></div>
	</div>
{/if}
