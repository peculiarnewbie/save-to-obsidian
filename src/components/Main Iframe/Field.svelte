<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import FieldInput from "./FieldInput.svelte";

	import { docHeaders, HeaderTypes, fieldReordering } from "../../utils/stores";
	import { get } from "svelte/store";
	import FieldMenu from "./FieldMenu.svelte";
	import ReorderableList from "../ReorderableList.svelte";
	import Icons, { icons } from "../Icons.svelte";

	export let index = 0;
	export let length;
	export let field;

	export let parentInspect;
	export let isEditing = false;

	export let reOrderField;

	let changingType = false;
	export let typeButton: HTMLElement = null;
	let selectingHead = false;
	let menuTarget: HTMLElement;

	let keyFocus = false;
	let valueFocus = false;

	let isBeingDragged = false;

	let keyValue = field.key;
	// for floating menu

	let xOffset = 0;
	let iconName: string;

	$: {
		if (changingType) {
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
		dispatch("deleteField", { index: index });
	};

	const startChangeFieldType = (e: Event) => {
		console.log(isBeingDragged);
		if (isBeingDragged) {
			isBeingDragged = false;
			(e.target as HTMLElement).blur();
			return;
		}
		if (changingType) typeButton.blur();
		changingType = !changingType;
	};

	const changeFieldType = (type: FieldInputKeys) => {
		field.type = type;
		changingType = !changingType;
	};

	if (index == 0) {
		field.type = InputEnum.Filename;
	}

	const reorderCleanup = () => {
		fieldReordering.set(false);
	};

	const updateIcon = (type) => {
		switch (type) {
			case InputEnum.Text:
				iconName = icons.text;
				break;
			case InputEnum.Date:
				iconName = icons.date;
				break;
			case HeaderTypes.Title:
				iconName = icons.title;
				break;
			case HeaderTypes.URL:
				iconName = icons.url;
				break;
			case HeaderTypes.Image:
				iconName = icons.image;
				break;
			default:
				iconName = icons.text;
				break;
		}
	};

	$: {
		if ($fieldReordering) {
			changingType = false;
			valueFocus = false;
		}
	}

	onMount(() => {
		updateIcon(field.type);
	});
</script>

{#if index == 0}
	{#if isEditing}
		<div class="pt-4">
			<p class=" text-sm font-bold mb-1">File Title</p>
			<div
				class={`flex border hover:border-neutral-600 rounded-md ${
					valueFocus
						? "bg-[#2f2f2f] border-2 border-neutral-600 p-0 py-[3px]"
						: "p-[1px] py-1 border-transparent"
				}`}
			>
				<button
					class="p-1 h-7 w-7 rounded-md bg-transparent hover:bg-[#363636] focus:bg-[#363636] shrink-0"
					on:click={selectElement}
					bind:this={typeButton}
				>
					<Icons iconName={icons.inspect}></Icons>
				</button>
				<FieldInput bind:field bind:valueFocus bind:menuTarget />
			</div>
		</div>
		<p class="pt-2 text-base font-semibold mb-1">Properties</p>
	{:else}
		<p class="text-base font-bold mb-1">{field.key}</p>
		<div
			class="flex gap-1 align-middle p-1 border hover:border-neutral-600 rounded-md border-transparent"
		>
			<FieldInput bind:field bind:valueFocus />
		</div>
		<p class="pt-2 text-base font-semibold mb-1">Properties</p>
	{/if}
{:else}
	<ReorderableList
		{reOrderField}
		{index}
		dragElement={typeButton}
		bind:isBeingDragged
		{length}
		startingIndex={1}
		{reorderCleanup}
	>
		<div>
			<!-- <p>{index}</p> -->
			{#if isEditing}
				<div class="h-fit w-full">
					<div
						class={`w-full bg-[#1e1e1e] flex border ${
							isBeingDragged ? "shadow-lg" : "hover:border-neutral-600"
						} rounded-md h-fit ${
							keyFocus || valueFocus || changingType
								? "border-2 border-neutral-600 p-0 z-[999999]"
								: "p-[1px] border-transparent"
						}`}
					>
						<div
							class={`flex w-1/3 shrink-0 items-start ${
								keyFocus ? "bg-[#2f2f2f]" : "bg-transparent"
							}`}
						>
							<button
								class={`p-1 h-7 w-7 rounded-md bg-transparent hover:bg-[#363636] hover:cursor-grabbing focus:bg-[#363636] shrink-0 ${
									isBeingDragged ? "cursor-grabbing " : ""
								}`}
								on:click={startChangeFieldType}
								bind:this={typeButton}
							>
								<Icons {iconName}></Icons>
							</button>

							{#if changingType}
								<FieldMenu
									bind:changingType
									{menuTarget}
									bind:field
									inspect={selectElement}
									{deleteField}
									bind:iconName
									{updateIcon}
								/>
							{/if}

							<input
								class="font-normal text-sm text-white h-7 w-full bg-transparent outline-none p-1 pr-2"
								type="text"
								placeholder="key title"
								bind:value={keyValue}
								on:focus={() => {
									keyFocus = true;
								}}
								on:blur={() => {
									keyFocus = false;
									field.key = keyValue;
								}}
							/>
						</div>
						<div
							class={`${
								valueFocus ? "bg-[#2f2f2f]" : "bg-transparent"
							} w-2/3 grow-0`}
						>
							<FieldInput bind:field bind:valueFocus bind:menuTarget />
						</div>
					</div>
				</div>
			{:else}
				<div
					class={`flex gap-1 align-middle hover:border-neutral-600 rounded-md ${
						valueFocus
							? "border-2 border-neutral-600 p-0 z-[999999]"
							: "border p-[1px] border-transparent"
					}`}
				>
					<div class="flex w-1/4 shrink-0 items-start">
						<div class="p-1 h-7 w-7 shrink-0">
							<Icons {iconName}></Icons>
						</div>
						<p
							class="font-normal text-sm text-white h-7 w-full bg-transparent outline-none p-1 pr-2"
						>
							{field.key}
						</p>
					</div>
					<div
						class={`${
							valueFocus ? "bg-[#2f2f2f]" : "bg-transparent"
						} w-3/4 grow-0`}
					>
						<FieldInput bind:field bind:valueFocus {menuTarget} />
					</div>
				</div>
			{/if}
		</div>
	</ReorderableList>
{/if}

<div class="w-full" bind:this={menuTarget} />

<style>
</style>
