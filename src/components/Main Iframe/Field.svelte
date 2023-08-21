<script lang="ts">
	import select from "../../../public/Select.svg";
	import trash from "../../../public/Delete.svg";
	import { createEventDispatcher } from "svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import FieldInput from "./FieldInput.svelte";
	export let index = 0;
	export let field;
	$: key = field.key;
	$: value = field.value;
	$: treePath = field.treePath;

	export let parentInspect;
	export let isEditing = false;

	let changingType = false;
	let typeButton;

	const dispatch = createEventDispatcher();

	const selectElement = () => {
		parentInspect(index);
	};

	const deleteField = () => {
		dispatch("deleteField", {index: index});
	};

	const startChangeFieldType = (e) => {
		typeButton = e.target as HTMLElement;
		changingType = !changingType;
	};

	document.addEventListener("click", (e) => {
		const element = e.target as HTMLElement;
		if(changingType && element != typeButton){
			changingType = false;
		}
	});

	const changeFieldType = (type: FieldInputKeys) => {
		field.type = type;
		changingType = !changingType;
	};

	if(index == 0){
		field.type = InputEnum.Filename;
	} else {
		field.type = InputEnum.Text;
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
				{#if import.meta.env.DEV}
					<img src={select} alt="select" width="15px" />
				{:else}
					<img src={chrome.runtime.getURL(select)} alt="select" width="15px" />
				{/if}
			</button>
			<FieldInput
				bind:field={field}
			/>
		</div>
		{#if index != 0}
			<button
				class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
				on:click={deleteField}
			>
				{#if import.meta.env.DEV}
					<img src={trash} alt="select" width="15px" />
				{:else}
					<img src={chrome.runtime.getURL(trash)} alt="select" width="15px" />
				{/if}
			</button>
			<button
				id="typebutton"
				class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
				on:click={startChangeFieldType}
			>
				{#if import.meta.env.DEV}
					<img src={trash} class="pointer-events-none" alt="select" width="15px" />
				{:else}
					<img src={chrome.runtime.getURL(trash)} class="pointer-events-none" alt="select" width="15px" />
				{/if}
			</button>
			{#if changingType}
				<div on:blur={() => changingType = false}
					class=" absolute flex flex-col font-bold text-base text-white w-44 min-w-[40px] bg-[#363636] outline-none  "
				>
					<button class="hover:bg-black" on:click={() => changeFieldType(InputEnum.Text)}>Text</button>
					<button class="hover:bg-black" on:click={() => changeFieldType(InputEnum.Filename)}>Filename</button>
				</div>
			{/if}
		{/if}
	{:else}
		<div id="FieldComponent" class="flex gap-1 align-middle pt-1">
			<p style="font-weight:700; font-size:16px">{key}</p>
			<FieldInput
				bind:field={field}
			/>
		</div>
	{/if}
</div>

<style>
</style>
