<script lang="ts">
	import Form from "./Form.svelte";
	import back from "../../../public/Back.svg";
	import "../../app.css";
	import { storeMessaging, Actions } from "../../utils/stores";

	import type {
		FieldType,
		FieldsType,
		FormType,
		AllDataType,
	} from "../../utils/types";
	import { InputEnum } from "../../utils/types";
	import ImportForm from "./components/ImportForm.svelte";

	let root: HTMLElement;
	let loading = true;
	let fields = [] as FieldsType;
	let forms: string[] = [];
	let allData = {} as AllDataType;
	let isEditing = false;
	let currentForm = {
		name: "",
		directory: "",
		fields: fields,
		fromBackground: false,
	} as FormType;

	let defaultDir = "Obsidian/";

	let openForm = false;
	let openSettings = false;

	const closePopup = () => {
		storeMessaging.set({ action: Actions.Dummy });
		chrome.runtime.sendMessage({ action: "closeExtension" });
	};

	const getChromeStorage = async () => {
		await chrome.storage.local.get(null, async (result) => {
			allData = result;
			forms = Object.keys(allData)
				.filter((item) => item.includes("form_"))
				.map((item) => item.replace("form_", ""));
			if (forms.length == 0) {
				forms = ["example"];
				let form_example = {
					name: "example",
					directory: "example/",
					fields: [
						{
							key: "file title",
							value: "Example Title",
							type: InputEnum.Filename,
						},
						{ key: "content", value: "", type: InputEnum.Text },
						{ key: "tags", value: "example, tags", type: InputEnum.Text },
						{ key: "date", value: "", type: InputEnum.Date },
					],
					fromBackground: false,
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
		fields = [
			{ key: "file title", value: "Untitled", type: InputEnum.Filename },
			{ key: "content", value: "", type: InputEnum.Text },
		];
		currentForm = {
			name: "New Form",
			directory: defaultDir,
			fields: fields,
			fromBackground: false,
		};
		isEditing = true;
		openForm = true;
	};

	const deleteForm = async (formName: string) => {
		await chrome.storage.local.remove([`form_${formName}`]);
		let newForms = forms.filter((item) => item != formName);
		await chrome.storage.local.set({ forms: newForms });
		forms = newForms;
	};

	const exportForms = () => {
		console.log("ello", allData);
		chrome.runtime.sendMessage({
			action: Actions.ExportForms,
			data: JSON.stringify(allData),
		});
	};

	const importForms = async (input: string) => {
		const data = JSON.parse(input);
		await chrome.storage.local.set(data);
		await getChromeStorage();
		openSettings = false;
	};

	const promise = getChromeStorage();
</script>

<div
	id="ActualRoot"
	class="ext flex flex-col rounded-xl h-full w-full bg-[#1e1e1e] overflow-hidden font-sans"
>
	<div id="Header" class="ext flex justify-between bg-[#363636]">
		{#if !openForm}
			<div class="flex pl-2">
				{#if openSettings}
					<button
						class="flex p-2 pb-1 rounded-md bg-transparent hover:bg-[#363636] items-center cursor-pointer"
						on:click={() => (openSettings = false)}
					>
						{#if import.meta.env.DEV}
							<img src={back} alt="back" width="20px" />
						{:else}
							<img src={chrome.runtime.getURL(back)} alt="back" width="20px" />
						{/if}
					</button>
				{/if}
				<div
					id="ExtensionTitle"
					class="ext text-2xl text-white font-bold my-3 pl-1 font-sans"
				>
					Markdown Clipper
				</div>
			</div>
		{:else}
			<div class="flex pl-2">
				<button
					class="flex p-2 pb-1 rounded-md bg-transparent hover:bg-[#363636] items-center cursor-pointer"
					on:click={() => {
						openForm = false;
						openSettings = false;
						currentForm = {
							name: "",
							directory: "",
							fields: [],
							fromBackground: false,
						};
						storeMessaging.set({ action: Actions.Dummy });
					}}
				>
					{#if import.meta.env.DEV}
						<img src={back} alt="back" width="20px" />
					{:else}
						<img src={chrome.runtime.getURL(back)} alt="back" width="20px" />
					{/if}
				</button>
				<h2
					class="my-3 pl-3 font-sans text-2xl font-bold text-white"
					id="ExtensionTitle"
				>
					{currentForm.name}
				</h2>
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
					<button class="btn" on:click={() => addForm()}>
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
						bind:currentForm
						{isEditing}
						bind:forms
						refresh={getChromeStorage}
					/>
				{:else if openSettings}
					<div class="p-3 flex flex-col gap-2 w-fit">
						<button on:click={exportForms} class="btn w-44">Export Forms</button
						>
						<ImportForm {importForms} />
					</div>
				{:else}
					<div class="p-3">
						<button class="btn" on:click={() => addForm()}>Add Form</button>
						{#each forms as form, i}
							<div>
								<div class="text-2xl text-white font-bold my-3 pl-3 font-sans">
									{form}
								</div>
								<button
									class="btn"
									on:click={async () => {
										currentForm = await JSON.parse(
											JSON.stringify(allData[`form_${form}`]),
										);
										isEditing = false;
										openForm = true;
									}}>Open Form</button
								>
								<button class="btn" on:click={() => deleteForm(form)}
									>Delete</button
								>
							</div>
						{/each}
						<button class="btn mt-4" on:click={() => (openSettings = true)}>
							Settings
						</button>
					</div>
				{/if}
			{/await}
		{/if}
	</div>
</div>

<style>
</style>
