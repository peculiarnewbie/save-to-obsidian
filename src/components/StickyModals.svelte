<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";
	import {
		formScroll,
		formTopLimit,
		formBottomLimit,
		mainIframeDoc,
	} from "../utils/stores";
	import { get } from "svelte/store";

	export let needToFlip = true;
	export let defaultLimits = false;
	export let topLimit = 70;
	export let bottomLimit = 700;
	export let yOffset = 0;
	export let xOffset = 0;
	export let sourceHeight = 0;
	export let menuTarget: HTMLElement | null = null;
	export let isActive = true;
	export let clickOffDoc: Document | null = null;

	export let padding = 8;

	let divHeight = 0;
	let formScrollValue = 0;
	let thisElement: HTMLElement;

	function getcurrentScroll() {
		return formScrollValue;
	}
	let yTransform = 0;
	let initScroll = 0;
	let initTop = 0;

	let mounted = false;

	$: {
		if (mounted) {
			const temp = formScrollValue;
			outputPos();
		}
	}

	onMount(() => {
		if (menuTarget) menuTarget.appendChild(thisElement);

		const rect = thisElement.getBoundingClientRect();
		divHeight = rect.height;
		initTop = rect.top - formScrollValue;
		initScroll = yTransform = getcurrentScroll();
		mounted = true;

		if (defaultLimits) {
			topLimit = get(formTopLimit);
			bottomLimit = get(formBottomLimit);
		}

		if (!clickOffDoc) clickOffDoc = get(mainIframeDoc);

		setTimeout(() => {
			clickOffDoc?.addEventListener("click", handleClickOff);
		}, 0);

		return () => {
			clickOffDoc?.removeEventListener("click", handleClickOff);
		};
	});

	const handleClickOff = (e: MouseEvent) => {
		const element = e.target as HTMLElement;
		if (!thisElement.contains(element)) {
			clickOffDoc?.removeEventListener("click", handleClickOff);
			isActive = false;
			console.log("clicking off");
		}
	};

	function outputPos() {
		const bottomPos = initTop + divHeight + (initScroll - formScrollValue);
		// console.log("formScrollValue: ", formScrollValue, "initScroll: ", initScroll, "initTop: ", initTop, "bottomPos: ", bottomPos)
		// console.log("topLimit: ", topLimit, "botLimit: ", bottomLimit)
		if (formScrollValue - initScroll > initTop - topLimit) {
			// console.log("exceed top");
			yTransform = initTop + initScroll - topLimit;
		} else if (bottomPos > bottomLimit) {
			// console.log("exceed bot");
			if (bottomPos < bottomLimit + divHeight + yOffset && needToFlip) {
				yTransform = formScrollValue + divHeight + yOffset + sourceHeight;
			} else {
				yTransform = formScrollValue + bottomPos - bottomLimit;
			}
		} else {
			yTransform = formScrollValue;
		}
	}

	const unsubscribe = formScroll.subscribe((value) => {
		formScrollValue = value;
	});

	onDestroy(unsubscribe);
</script>

<div
	class="absolute overscroll-none"
	bind:this={thisElement}
	style={`will-change:transform; transform: translate3d(${
		xOffset - padding
	}px, ${
		yOffset - yTransform - padding
	}px, 0px); z-index: 9999999; padding: ${padding}px`}
>
	<slot />
</div>
