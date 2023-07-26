<script lang="ts">
	import select from "../../public/Select.svg";
	import trash from "../../public/Delete.svg";
	import { createEventDispatcher } from "svelte";
	export let index = 0;
	export let field;
	$: key = field.key;
	$: value = field.value;
	$: treePath = field.treePath;

	export let parentInspect;
	export let isEditing = false;

	enum IdType {
		ID,
		CLASS,
		INDEX,
	}

	const dispatch = createEventDispatcher();

	// const initField = async() => {
	//     console.log("init field")
	//     if(field.treePath){
	//         await getValueFromPath(field.treePath)
	//     }
	// }

	const selectElement = () => {
		document.getElementById("extension-html").classList.add("hidden");
		parentInspect(index);
	};

	const getValueFromPath = async (path, selectedElement?) => {
		let fetching = true;

		chrome.runtime.sendMessage(
			{ action: "getElement", path: path },
			(response) => {
				if (!response.success) {
					console.error("failed to get element");
				} else {
					field.value = response.value;
					fetching = false;
				}
			}
		);

		while (fetching) {
			await new Promise((r) => setTimeout(r, 10));
		}
		console.log("got value", field.value);
	};

	const deleteField = () => {
		dispatch("deleteField", index);
	};

	// initField()
</script>

<div id="FieldRoot" class="pt-3">
	<!-- <p>{index}</p> -->
	{#if isEditing}
		<input
			class="font-bold text-base text-white w-full min-w-[40px] h-8 bg-transparent outline-none border-b border-[#3e4446]"
			type="text"
			placeholder="enter key"
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
					<img
						src={chrome.runtime.getURL(select)}
						alt="select"
						width="15px"
					/>
				{/if}
			</button>
			<input
				class=" font-normal text-base text-white w-full min-w-[40px] h-8 bg-transparent outline-none border-b border-[#3e4446]"
				type="text"
				placeholder="select data or type here"
				bind:value={field.value}
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
					<img
						src={chrome.runtime.getURL(trash)}
						alt="select"
						width="15px"
					/>
				{/if}
			</button>
		{/if}
	{:else}
		<div id="FieldComponent" class="flex gap-1 align-middle pt-1">
			<p style="font-weight:700; font-size:16px">{key}</p>
			<p>{value}</p>
		</div>
	{/if}
</div>

<style>
</style>
