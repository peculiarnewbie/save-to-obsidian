<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import TestButtons from "../Test/TestButtons.svelte";
	import { currentSelectedElement, storeMessaging, Actions } from "../../utils/stores";
	import "../../app.css"

	export let extensionId;
	let getElementValueFromPath;
	// $: currentElement = selectedElement;
	
	let treePath;
	let selectedElement 

	enum ElementType {
		TEXT,
		IMG,
	}

	let elementType;
	let elementValue;

	$: {
		console.log(selectedElement)
		if(selectedElement){
			elementType = determineNodeType(selectedElement);
			elementValue = determineElementValue(selectedElement);
		} 

	}

	let selectableElements = [];
	let showChildren = false;
	let showSiblings = false;

	let siblingCount = 0;
	let childrenCount = 0;

	enum IdType {
		ID,
		CLASS,
		INDEX,
	}

	const FinishSelection = () => {
		storeMessaging.set({action: Actions.FinishSelection})
		
		selectedElement = null;
	};

	const moveSelection = (element) => {
		selectedElement = element
		// console.log(element, element.childElementCount, element.parentElement.childElementCount)
		childrenCount = selectedElement.childElementCount;
		siblingCount = selectedElement.parentElement?.childElementCount - 1;

		currentSelectedElement.set(selectedElement);
	}

	const getParentElement = () => {
		if (selectedElement.parentElement) {
			moveSelection(selectedElement.parentElement);
		} else {
			return selectedElement;
		}
	};

	

	

	const determineNodeType = (element) => {
		if (element.nodeName == "IMG") {
			return ElementType.IMG;
		} else {
			return ElementType.TEXT;
		}
	};

	const determineElementValue = (element) => {
		if (element.nodeName == "IMG") {
			return element.src;
		} else {
			return element.innerText;
		}
	};

	const getElementChildren = (element) => {
		let children = [];
		for (let i = 0; i < element.children.length; i++) {
			children.push(element.children[i]);
		}
		return children;
	};

	const getElementSiblings = (element) => {
		let siblings = [];
		for (let i = 0; i < element.parentElement.children.length; i++) {
			siblings.push(element.parentElement.children[i]);
		}
		return siblings;
	};

	// onMount(() => {
	// 	selectedElement = get(currentSelectedElement);
	// 	moveSelection(selectedElement);
	// })


	const unsubscribe = storeMessaging.subscribe((message) => {
		const action = message.action;
		if(action == Actions.FinishHover){
			selectedElement = get(currentSelectedElement);
			moveSelection(selectedElement);
		}
	})

	$:{
		selectedElement = $currentSelectedElement;
	}

	onDestroy(unsubscribe);

</script>

<div class="flex bg-[#242424] w-fit rounded-md">
	<div class="flex flex-col p-2 gap-3">
		<div style="color: white;">
			Result:
			<div id="resultBox" class="bg-[#1e1e1e] h-fit p-1 mt-2 min-h-[50px] max-w-xs max-h-64 overflow-auto">
				{#if elementType == ElementType.TEXT}
					<p>{elementValue}</p>
				{:else if elementType == ElementType.IMG}
					<div class="max-w-250px max-h-[250px]">
						<img
							class="max-w-full max-h-full"
							src={elementValue}
							alt="selected"
						/>
					</div>
				{/if}
			</div>
		</div>
		<div style="display: flex; gap:12px">
			<div>
				<p>siblings: {siblingCount}</p>
				<p>direct childrens: {childrenCount}</p>
			</div>
			<button class="btn" on:click={getParentElement}
				>Select Parent</button
			>
			<button class="btn" on:click={FinishSelection}
				>Done</button
			>
		</div>
	</div>
</div>

{#if import.meta.env.DEV}
	<TestButtons bind:selectedElement />
{/if}

<style>
</style>
