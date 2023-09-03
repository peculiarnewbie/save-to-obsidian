<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import { currentSelectedElement, storeMessaging, Actions } from "../../utils/stores";

	export let extensionId;

	let selectedElement;

	const ElementType = {
		TEXT : "text",
		IMG: "img",

	} as const

	let tempElement = null;

	let elementType;
	let elementValue;

	let elementList: HTMLElement[] = [];
	let selectingList = false;

	let siblingCount = 0;
	let childrenCount = 0;

	const FinishSelection = () => {
		storeMessaging.set({action: Actions.FinishSelection})
		
		selectedElement = null;
	};

	const selectAgain = () => {
		storeMessaging.set({action:Actions.StartInspect})
	}

	const moveSelection = (element, fromHover) => {
		selectedElement = element;
		selectingList = false;
		
		elementType = determineNodeType(selectedElement);
		elementValue = determineElementValue(selectedElement);
		// console.log(element, element.childElementCount, element.parentElement.childElementCount)
		childrenCount = selectedElement.childElementCount;
		siblingCount = selectedElement.parentElement?.childElementCount - 1;

		if(!fromHover) currentSelectedElement.set(selectedElement);
	}

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

	const getElementList = (element) => {
		selectingList = true;
		let list = [];

		for (let i = 0; i < element.children.length; i++) {
			list.push(element.children[i]);
		}

		elementList = list;
	}

	const setDetailElement = (element) => {
		tempElement = element
		elementType = determineNodeType(element)
		elementValue = determineElementValue(element)
		getElementList(element)
	}

	const highlightElement = (element) => {
		currentSelectedElement.set(element)
	}


	const unsubscribe = storeMessaging.subscribe((message) => {
		const action = message.action;
		if(action == Actions.FinishHover){
			selectedElement = get(currentSelectedElement);
			console.log(selectedElement)
			moveSelection(selectedElement, true);
		}
	})

	onDestroy(unsubscribe);

</script>

<div class="w-full flex justify-end">
	<div class="flex bg-[#242424] w-full rounded-md">
		<div class="flex flex-col w-full p-2 gap-3 self-end">
			<div class="text-white">
				Result:
				<div id="resultBox" class="bg-[#1e1e1e] p-1 mt-2 w-full h-64 overflow-auto">
					{#if elementType == ElementType.TEXT}
						<p>{elementValue}</p>
					{:else if elementType == ElementType.IMG}
						<div class="w-full h-60">
							<img
								class="max-w-full max-h-full"
								src={elementValue}
								alt="selected"
							/>
						</div>
					{/if}
				</div>
			</div>
			{#if selectingList}
				<div class="flex flex-col gap-4">
					<button on:click={() => {setDetailElement(tempElement.parentElement ? tempElement.parentElement : tempElement)}} class="btn">Select Parent</button>
					<div class="flex flex-col gap-2">
						{#each elementList as element}
							<button on:pointerenter={() => highlightElement(element)} on:click={() => setDetailElement(element)} class="max-h-12 bg-slate-700 flex">
								<div class="w-1/5">
									{element.tagName}
								</div>
								<div class=" overflow-hidden h-12">
									{element.innerText}
								</div>
							</button>
						{/each}
						<div class="flex gap-2">
							<button class="btn w-full" on:click={() => {moveSelection(selectedElement, false)}}>Cancel</button>
							<button class="btn w-full" on:click={() => {moveSelection(tempElement, false)}}>Done</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="gap-3 flex flex-col">
					<button class="btn" on:click={() => {selectingList = true; setDetailElement(selectedElement)}}>Detail Select</button>
					<!-- <button class="btn" on:click={() => getElementList(false)}>Select Children ({childrenCount})</button> -->
					<button class="btn" on:click={selectAgain}>Select Again</button>
					<button class="btn" on:click={FinishSelection}>Done</button>
				</div>
			{/if}
		</div>
	</div>

</div>

<style>
</style>
