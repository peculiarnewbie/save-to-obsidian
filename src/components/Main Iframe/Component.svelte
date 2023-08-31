<script lang="ts">
	import Form from "./Form.svelte";
	import back from "../../../public/Back.svg";
	import "../../app.css"
	import { InputEnum } from "../../utils/FieldInputType";
	import { storeMessaging, Actions } from "../../utils/stores";

	let root: HTMLElement;
	let loading = true;
	let fields = [{ key: "", value: "", type: "" }];
	let forms: string[] = [];
	let allData = {};
	let isEditing = false;
	let currentForm = { name: "", directory: "", fields: fields };

	let defaultDir = "Obsidian/"

	let openForm = false;

	const closePopup = () => {
		storeMessaging.set({action: Actions.Dummy})
		chrome.runtime.sendMessage({ action: "closeExtension" });
	};

	const getChromeStorage = async () => {
		await chrome.storage.local.get(null, async (result) => {
			allData = result;
			console.log(result);
			forms = Object.keys(allData)
				.filter((item) => item.includes("form_"))
				.map((item) => item.replace("form_", ""));
			if (forms.length == 0) {
				forms = ["example"];
				let form_example = {
					name: "example",
					directory: "example/",
					fields: [
						{ key: "title", value: "Example Title" },
						{ key: "tags", value: "example, tags" },
						{ key: "description", value: "Example Description" },
					],
				};
				await chrome.storage.local.set({
					forms: forms,
					form_example: form_example,
				});
				allData["form_example"] = form_example;
			}
			loading = false;
		});
	};

	const addForm = () => {
		fields = [{ key: "file title", value: "Untitled", type: InputEnum.Filename }];
		currentForm = { name: "New Form", directory:defaultDir, fields: fields };
		isEditing = true;
		openForm = true;
	}

	const deleteForm = async (form) => {
		await chrome.storage.local.remove([`form_${form}`]);
		let newForms = forms.filter((item) => item != form);
		await chrome.storage.local.set({ forms: newForms });
		forms = newForms;
	};

	const promise = getChromeStorage();

</script>

<div
	id="ActualRoot"
	class="ext flex flex-col rounded-xl h-full w-full bg-[#242424] overflow-hidden font-sans"
>
	<div id="Header" class="ext flex justify-between bg-[#363636]">
		{#if !openForm}
			<div
				id="ExtensionTitle"
				class="ext text-2xl text-white font-bold my-3 pl-3 font-sans"
			>
				Markdown Clipper
			</div>
		{:else}
			<div class="flex pl-2">
				<button
					class="flex p-2 pb-1 rounded-md bg-transparent hover:bg-[#363636] items-center cursor-pointer"
					on:click={() => {
						openForm = false;
					}}
				>
					{#if import.meta.env.DEV}
						<img src={back} alt="back" width="20px" />
					{:else}
						<img src={chrome.runtime.getURL(back)} alt="back" width="20px" />
					{/if}
				</button>
				<h2 class="my-3 pl-3 font-sans text-2xl font-bold text-white" id="ExtensionTitle">{currentForm.name}</h2>
			</div>
		{/if}
		<button
			id="CloseButton"
			class="flex bg-transparent text-2xl text-white py-3 px-5 hover:bg-red-500"
			on:click={closePopup}
		>
			x
		</button>
	</div>
	<div id="MainContent" class="ext flex flex-col flex-grow-[10] max-h-[92%]">
		{#if import.meta.env.DEV}
			{#if openForm}
				<Form
					{root}
					bind:currentForm
					{isEditing}
					bind:forms
					refresh={getChromeStorage}
				/>
			{:else}
				<div class="ext p-3">
					<button
						class="btn"
						on:click={() => addForm()}
					>
						<div class="text-white font-normal font-sans">Add Form</div>
					</button>
				</div>
			{/if}
		{:else}
			{#await promise}
				<div class="text-white font-normal font-sans">loading...</div>
			{:then}
				{#if openForm}
					<Form
						{root}
						{currentForm}
						{isEditing}
						bind:forms
						refresh={getChromeStorage}
					/>
				{:else}
					<div class="p-3">
						<button
							class="btn"
							on:click={() => addForm()}>Add Form</button
						>
						{#each forms as form, i}
							<div id="Form">
								<div class="text-2xl text-white font-bold my-3 pl-3 font-sans">
									{form}
								</div>
								<button
									class="btn"
									on:click={async () => {
										currentForm = await JSON.parse(JSON.stringify(allData[`form_${form}`]));
										isEditing = false;
										openForm = true;
									}}>Open Form</button
								>
								<button class="btn" on:click={() => deleteForm(form)}
									>Delete</button
								>
							</div>
						{/each}
					</div>
				{/if}
			{/await}
		{/if}
	</div>
</div>

<style>
</style>
