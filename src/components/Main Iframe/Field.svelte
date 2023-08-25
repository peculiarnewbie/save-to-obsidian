<script lang="ts">
	import select from "../../../public/Select.svg";
	import trash from "../../../public/Delete.svg";
	import { createEventDispatcher } from "svelte";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import FieldInput from "./FieldInput.svelte";
	import CustomImage from "../CustomImage.svelte";
	export let index = 0;
	export let field;

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
				class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
				on:click={startChangeFieldType}
			>
				<CustomImage src={trash} alt="trash" width="15px" />
			</button>
			{#if changingType}
				<div class="absolute left-12 flex flex-col font-bold text-base shadow-lg text-white w-44 min-w-[40px] bg-[#363636] outline-none p-2 rounded-md">
					<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Text)}>Text</button>
					<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.List)}>List</button>
					<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.MultiList)}>MultiList</button>
					<button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Date)}>Date</button>
				</div>
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
