<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import { currentSelectedElement, storeMessaging, Actions } from "../../utils/stores";

	export let extensionId;

	let selectedElement;

	enum ElementType {
		TEXT,
		IMG,
	}

	let elementType;
	let elementValue;

	let elementList: HTMLElement[] = [];
	let selectingList = false;

	let selectableElements = [];
	let showChildren = false;
	let showSiblings = false;

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

	const getParentElement = () => {
		if (selectedElement.parentElement) {
			moveSelection(selectedElement.parentElement, false);
		} else {
			return;
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

	const getElementList = (sibling) => {
		selectingList = true;
		let list = [];

		let element;
		if(sibling) element = selectedElement.parentElement;
		else element = selectedElement;

		for (let i = 0; i < element.children.length; i++) {
			if(element.children[i] != selectedElement)
				list.push(element.children[i]);
		}

		elementList = list;
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
					<button on:click={() => {selectingList = false; highlightElement(selectedElement)}} class="btn">Back</button>
					<div class="flex flex-col gap-2">
						{#each elementList as element}
							<button on:pointerenter={() => highlightElement(element)} on:click={() => moveSelection(element, false)} class="max-h-12 bg-slate-700 flex">
								<div class="w-1/5">
									{element.tagName}
								</div>
								<div class=" overflow-hidden h-12">
									{element.innerText}
								</div>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="gap-3 flex flex-col">
					
					<button class="btn" on:click={getParentElement}>Select Parent</button>
					<button class="btn" on:click={() => getElementList(true)}>Select Siblings ({siblingCount})</button>
					<button class="btn" on:click={() => getElementList(false)}>Select Children ({childrenCount})</button>
					<button class="btn" on:click={selectAgain}>Select Again</button>
					<button class="btn" on:click={FinishSelection}>Done</button>
				</div>
			{/if}
		</div>
	</div>

</div>

<style>
</style>
