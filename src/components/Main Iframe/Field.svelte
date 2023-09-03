<script lang="ts">
	import select from "../../../public/Select.svg";
	import trash from "../../../public/Delete.svg";
	import { createEventDispatcher } from "svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import FieldInput from "./FieldInput.svelte";
	import CustomImage from "../CustomImage.svelte";
	import StickyModals from "../StickyModals.svelte";
	import { IdType } from "../../utils/ElementFetcher";

	import { formTopLimit, formBottomLimit, docHeaders, HeaderTypes } from "../../utils/stores";
    import { get } from "svelte/store";

	export let index = 0;
	export let field;

	export let parentInspect;
	export let isEditing = false;

	let changingType = false;
	let typeButton: HTMLElement;
	let typeMenu: HTMLElement;
	let selectingHead = false;

	// for floating menu
	let topLimit = get(formTopLimit);
	let bottomLimit = get(formBottomLimit);
	let xOffset = 0;

	$:{
		if(changingType){
			xOffset = typeButton.getBoundingClientRect().left;
		}
		else{
			document.removeEventListener("click", listenToOutsideClicks)
		}
	}

	const dispatch = createEventDispatcher();

	const selectElement = () => {
		parentInspect(index);
	};

	const deleteField = () => {
		dispatch("deleteField", {index: index});
	};

	const startChangeFieldType = (e) => {	
		topLimit = get(formTopLimit)
		bottomLimit = get(formBottomLimit);
		document.addEventListener("click", listenToOutsideClicks)
		if(changingType) typeButton.blur()
		changingType = !changingType;
	};

	const listenToOutsideClicks = (e) => {
		const element = e.target as HTMLElement;
		if(changingType && !typeMenu.contains(element) && element != typeButton){
			changingType = false;
		}
	}

	const changeFieldType = (type: FieldInputKeys) => {
		field.type = type;
		changingType = !changingType;
	};

	const startSelectHead = () => {
		topLimit = get(formTopLimit);
		bottomLimit = get(formBottomLimit);
		console.log("top: ", topLimit, "bottom: ", bottomLimit)
		selectingHead = true;
	}

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

	// initField()
</script>

<div id="FieldRoot" class="pt-3">
	<!-- <p>{index}</p> -->
	{#if isEditing}
		<input
			class="font-bold text-base text-white w-full min-w-[40px] h-8 bg-transparent outline-none border-b border-[#3e4446]"
			type="text"
			placeholder="key title"
			bind:value={field.key}
		/>
		<div id="FieldComponent" class="flex gap-1 align-middle pt-1">
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
			<FieldInput
				bind:field={field}
			/>
		</div>
		{#if index != 0}
			<button
				class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
				on:click={deleteField}
			>
				<CustomImage src={trash} alt="trash" width="15px" />
			</button>
			<button
				id="typebutton"
				class="p-2 rounded-md bg-transparent hover:bg-[#363636] focus:bg-[#363636]"
				on:click={startChangeFieldType}
				bind:this={typeButton}
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
		{/if}
	{:else}
		<div id="FieldComponent" class="flex gap-1 align-middle pt-1">
			<p style="font-weight:700; font-size:16px">{field.key}</p>
			<FieldInput
				bind:field={field}
			/>
		</div>
	{/if}
</div>

<style>
</style>
