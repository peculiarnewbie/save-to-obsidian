<script lang="ts">
	import select from "../../../public/Select.svg";
	import trash from "../../../public/Delete.svg";
	import { createEventDispatcher } from "svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import FieldInput from "./FieldInput.svelte";
	import CustomImage from "../CustomImage.svelte";
	import StickyModals from "../StickyModals.svelte";
	import { IdType } from "../../utils/ElementFetcher"

	import { formTopLimit, formBottomLimit, docHeaders, HeaderTypes, mainIframeDoc } from "../../utils/stores";
    import { get } from "svelte/store";
	import FieldMenu from "./FieldMenu.svelte";

	export let index = 0;
	export let field;

	export let parentInspect;
	export let isEditing = false;

	let changingType = false;
	let typeButton: HTMLElement;
	let typeMenu: HTMLElement;
	let selectingHead = false;
	let menuTarget: HTMLElement;

	let keyFocus = false;
	let valueFocus = false;

	let isBeingDragged = false;
	let xDrag = 0;
	let yDrag = 0;
	let xDragInit = 0;
	let yDragInit = 0;

	// for floating menu
	
	let xOffset = 0;

	$:{
		if(changingType){
			xOffset = typeButton.getBoundingClientRect().left;
		}
		// else{
		// 	$mainIframeDoc.removeEventListener("click", listenToOutsideClicks)
		// }
	}

	const dispatch = createEventDispatcher();

	const selectElement = () => {
		parentInspect(index);
	};

	const deleteField = () => {
		dispatch("deleteField", {index: index});
	};

	const startChangeFieldType = (e:Event) => {
		// topLimit = get(formTopLimit)
		// bottomLimit = get(formBottomLimit);
		// $mainIframeDoc.addEventListener("click", listenToOutsideClicks)
		if(changingType) typeButton.blur()
		changingType = !changingType;
	};

	// const listenToOutsideClicks = (e) => {
	// 	const element = e.target as HTMLElement;
	// 	if(changingType && !typeMenu.contains(element) && element != typeButton){
	// 		changingType = false;
	// 	}
	// }

	const changeFieldType = (type: FieldInputKeys) => {
		field.type = type;
		changingType = !changingType;
	};

	const handleStartDragging = (e:DragEvent) => {
		xDragInit = e.clientX;
		yDragInit = e.clientY;
		isBeingDragged = true;
	}

	const handleStopDragging = (e:DragEvent) => {
		xDrag = 0;
		yDrag = 0;
		isBeingDragged = false;
	}

	const handleDragging = (e:DragEvent) => {
		e.preventDefault()
		console.log("x: ", xDragInit, xDrag, "y: ", yDragInit, yDrag)
		xDrag = xDragInit - e.clientX;
		yDrag = yDragInit - e.clientY
	}

	// const startSelectHead = () => {
	// 	topLimit = get(formTopLimit);
	// 	bottomLimit = get(formBottomLimit);
	// 	console.log("top: ", topLimit, "bottom: ", bottomLimit)
	// 	selectingHead = true;
	// }

	const selectHead = (type: HeaderTypes) => {
		let header : HTMLMetaElement;
		let path: string;
		switch(type){
			case HeaderTypes.Title:
				header = get(docHeaders).title;
				path = "title"
				break;
			case HeaderTypes.URL:
				header = get(docHeaders).url;
				path = "url";
				break;
			case HeaderTypes.Image:
				header = get(docHeaders).image;
				path = "image"
				break;
		}
		field.value = header.content;
		field.path = [{type: IdType.HEAD, value: path}]

		selectingHead = false
	}

	if(index == 0){
		field.type = InputEnum.Filename;
	}

	$: {
		console.log(changingType)
	}
</script>

<div>
	<!-- <p>{index}</p> -->
	{#if index == 0}
		{#if isEditing}
			<div class="pt-4">
				<p class=" text-sm font-bold mb-1">File Title</p>
				<div class="flex border border-transparent hover:border-neutral-600 rounded-md py-1">
					<button
							id="typebutton"
							class="p-1 h-7 w-7 rounded-md bg-transparent hover:bg-[#363636] focus:bg-[#363636] shrink-0"
							on:click={selectElement}
							bind:this={typeButton}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-square w-full h-full"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/></svg>
						</button>
					<input
						class="font-bold text-xl text-white h-7 w-full bg-transparent outline-none p-1 pr-2 "
						type="text"
						placeholder="key title"
						bind:value={field.value}
					/>
				</div>
				<p class="pt-2 text-base font-semibold mb-1">Properties</p>
			</div>
		{:else}
			<div></div>
		{/if}
	{:else}
		{#if isEditing}
			<div class="h-8 w-full">
				<div class={`w-full bg-[#1e1e1e] flex border hover:border-neutral-600 rounded-md h-8 ${keyFocus || valueFocus || changingType ? "border-2 border-neutral-600 p-0 z-[999999]" : "p-[1px] border-transparent"}`}
					style={`will-change:transform; transform: translate3d(${-xDrag}px, ${-yDrag}px, 0px); ${isBeingDragged? "z-index: 999999;" : ""}`}>
					<div class={`flex w-36 items-center ${keyFocus ? "bg-[#2f2f2f]" : "bg-transparent"}`} >
						
						<button
							id="typebutton"
							class="p-1 h-7 w-7 rounded-md bg-transparent hover:bg-[#363636] focus:bg-[#363636] shrink-0"
							on:click={startChangeFieldType}
							on:dragstart={handleStartDragging}
							on:drag={handleDragging}
							on:dragend={handleStopDragging}
							bind:this={typeButton}
							draggable="true"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tags w-full h-full pointer-events-none"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/></svg>
							
						</button>

						{#if changingType}
							<FieldMenu bind:changingType={changingType} menuTarget={menuTarget} bind:field={field}/>
						{/if}
						
						<input
							class="font-normal text-sm text-white h-7 w-full bg-transparent outline-none p-1 pr-2"
							type="text"
							placeholder="key title"
							bind:value={field.key}
							on:focus={() => {keyFocus = true}}
							on:blur={() => {keyFocus = false}}
						/>
					</div>
					<div class={`${valueFocus ? "bg-[#2f2f2f]" : "bg-transparent"} grow flex`}>
						<FieldInput
							bind:field={field}
							bind:valueFocus={valueFocus}
							bind:menuTarget={menuTarget}
						/>
					</div>
				</div>
				<div bind:this={menuTarget}/>
				{#if isBeingDragged}
					<div class="h-8 w-full bg-white"></div>
				{/if}
			</div>
			
			
		{:else}
			<div id="FieldComponent" class="flex gap-1 align-middle pt-1">
				<p style="font-weight:700; font-size:16px">{field.key}</p>
				<FieldInput
					bind:field={field}
					bind:valueFocus={valueFocus}
				/>
			</div>
		{/if}
	{/if}
		<!-- <div id="FieldComponent" class="flex gap-1 align-middle pt-1">
			<button
				class="p-2 rounded-md bg-transparent hover:bg-[#363636] pb-1"
				on:click={selectElement}
			>
				<CustomImage src={select} alt="select" width="15px" />
			</button>
			<button
				class="p-2 rounded-md bg-transparent hover:bg-[#363636] pb-1"
				on:click={startSelectHead}
			>
				<CustomImage src={select} alt="select" width="15px" />
			</button>
			{#if selectingHead}
				<StickyModals needToFlip={false} {topLimit} {bottomLimit} yOffset={-4} xOffset={28}>
					<div class="left-12 flex flex-col font-bold text-base shadow-lg text-white w-44 min-w-[40px] bg-[#363636] outline-none p-2 rounded-md">
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => selectHead(HeaderTypes.Title)}>Title</button>
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => selectHead(HeaderTypes.URL)}>URL</button>
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => selectHead(HeaderTypes.Image)}>Image</button>
					</div>
				</StickyModals>
			{/if}
			
		</div> -->
		<!-- {#if index != 0}
			<button
				class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
				on:click={deleteField}
			>
				<CustomImage src={trash} alt="trash" width="15px" />
			</button>
			
			{#if changingType}
				<StickyModals needToFlip={false} {topLimit} {bottomLimit} yOffset={-4} xOffset={28}>
					<div bind:this={typeMenu} class="left-12 flex flex-col font-bold text-base shadow-lg text-white w-44 min-w-[40px] bg-[#363636] outline-none p-2 rounded-md">
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Text)}>Text</button>
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.List)}>List</button>
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.MultiList)}>MultiList</button>
						<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Date)}>Date</button>
					</div>
				</StickyModals>
			{/if}
		{/if} -->
</div>

<style>
</style>
