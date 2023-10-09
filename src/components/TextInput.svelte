<script lang="ts">
	import { onMount } from "svelte";
	import { pauseScrolling } from "../utils/stores"; //Just for weird iframe scroll behaviour

	export let inputValue = "";
	export let placeholder = "No value";
	export let valueFocus = false;
	export let hasOutline = false;

	let isPlaceholder = true;

	const textFocus = (e: Event, focus: boolean) => {
		const div = e.target as HTMLElement;
		if (focus) {
			if (div.innerText == placeholder) div.innerText = "";
			valueFocus = true;
			isPlaceholder = false;
		} else {
			if (div.innerText == "") div.innerText = placeholder;
			valueFocus = false;
			checkForPlaceholder();
		}
	};

	const checkForPlaceholder = () => {
		if (inputValue == placeholder || inputValue == "") isPlaceholder = true;
		else isPlaceholder = false;
	};

	onMount(() => {
		checkForPlaceholder();
	});
</script>

<div
	class={`max-h-32 outline-none w-full overscroll-y-auto overflow-y-auto px-2 ${
		isPlaceholder ? "text-neutral-600" : ""
	} ${
		hasOutline
			? `border border-neutral-600 rounded-lg py-1 ${
					valueFocus ? "bg-[#2f2f2f]" : ""
			  }`
			: ""
	}`}
	contenteditable="true"
	bind:textContent={inputValue}
	on:focus={(e) => {
		textFocus(e, true);
	}}
	on:blur={(e) => {
		textFocus(e, false);
	}}
	on:pointerover={() => {
		pauseScrolling.set(true);
	}}
	on:pointerleave={() => {
		pauseScrolling.set(false);
	}}
	{placeholder}
/>
