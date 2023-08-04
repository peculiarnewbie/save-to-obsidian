<script lang="ts">
	import sanitizeString from "../../utils/SanitizeString";
	import Field from "./Field.svelte";
	export let root: HTMLElement;
	export let currentForm;
	export let isEditing;
	let fields;
	let prevName;
	let hoveredElement;
	$: {
		let temp = [...currentForm.fields];
		temp.splice(0, 1);
		fields = temp;
	}
	$: data = `---<br>${fields
		.map((field) => {
			return `${field.key}: ${field.value}`;
		})
		.join("<br>")}<br>---<br>`;
	export let forms;
	export let refresh;
	let selectionIndex: number;
	
	$: directory = currentForm.directory;

	if(directory == ""){
		currentForm.directory = "Obsidian/";
	}

	$: fullTitle =
		directory + sanitizeString(currentForm.fields[0].value) + ".md";

	if (!import.meta.env.DEV) {
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action === "bgElementSelected") {
				document.getElementById("extension-html").classList.remove("hidden");
				sendResponse({ success: true });
				currentForm.fields[selectionIndex].treePath = request.path;
				currentForm.fields[selectionIndex].value = request.value;
			}
			if (request.action === "bgValuesUpdated") {
				request.values.forEach((value, index) => {
					currentForm.fields[index].value = value;
				});
			}
		});
	}

	const download = () => {
		data = `---\n`;
		fields.forEach((field) => {
			data += `${field.key}: ${field.value}\n`;
		});
		data += `---\n`;


		chrome.runtime.sendMessage(
			{
				action: "download",
				data: data,
				title: fullTitle,
			},
			(response) => {
				if (response.success) {
					chrome.runtime.sendMessage({ message: "closePopup" });
				}
			},
		);
	};

	const addField = () => {
		currentForm.fields = [...currentForm.fields, { key: "", value: "" }];
	};

	function deleteField(event) {
		let temps = [...currentForm.fields];
		temps.splice(event.detail.index, 1);
		currentForm.fields = temps;
	}

	const inspect = async (index) => {
		selectionIndex = index;
		chrome.runtime.sendMessage({ action: "inspect" });
	};

	const saveForm = async () => {
		if (!forms.includes(currentForm.name)) {
			await chrome.storage.local.remove([`form_${prevName}`]);
			let temp = forms;
			temp[temp.indexOf(prevName)] = currentForm.name;
			forms = temp;
			await chrome.storage.local.set({ forms: forms });
		}
		await chrome.storage.local.set({
			[`form_${currentForm.name}`]: currentForm,
			forms: forms,
		});
		await refresh();
		isEditing = false;
	};

	const updateFieldValues = () => {
		let paths = currentForm.fields.map((field) => field.treePath);

		chrome.runtime.sendMessage(
			{ action: "getElements", paths: paths },
			(response) => {
				if (!response.success) {
					console.error("failed to get element");
				} else {
					response.values.forEach((value, index) => {
						if(!value){
							return;
						}
						currentForm.fields[index].value = value;
					});
				}
			},
		);
	};

	prevName = currentForm.name;

	if (!isEditing) {
		updateFieldValues();
	}
</script>

<div id="Form" class="pt-1 min-h-28 p-4 overflow-y-auto flex-grow-[10]">
	{#if isEditing}
		<div style="display: flex; justify-content:space-between; align-items:end">
			<div>
				<p class="text-xl font-semibold">Form Title:</p>
				<input
					type="text"
					placeholder="enter form name"
					bind:value={currentForm.name}
				/>
			</div>
			<div>
				<p class="text-xl font-semibold">Directory:</p>
				<input
					type="text"
					placeholder="enter directory"
					bind:value={currentForm.directory}
				/>
			</div>
			<button class="btn-primary" on:click={addField}>Add Field</button>
		</div>
	{:else}
		<button
			class="btn-primary"
			on:click={() => {
				isEditing = true;
			}}>Edit</button
		>
	{/if}

	{#each currentForm.fields as field, i}
		<Field
			index={i}
			bind:field
			parentInspect={inspect}
			on:deleteField={deleteField}
			{isEditing}
		/>
	{/each}
</div>

<div
	id="result"
	class="flex flex-col text-white h-48 bg-[#1e1e1e] p-3 pb-5 border-t border-[#363636] bottom-0"
>
	<div class="flex justify-between items-center mb-2">
		<p style="margin: 0;">result:</p>
	</div>
	<div
		id="rawData"
		class="h-full grow-10 overflow-y-auto bg-[#242424] p-2 text-xs"
	>
		<p style="margin: 0;">{@html data}</p>
	</div>
	<div class="flex justify-between mt-2 align-middle">
		<div class="flex flex-col h-full">
			<p>full path:</p>
			<p>{fullTitle}</p>
		</div>
		{#if isEditing}
			<button class="btn-primary" on:click={saveForm}>Save</button>
		{:else}
			<button class="btn-primary" on:click={download}>Download</button>
		{/if}
	</div>
</div>

<style>
	h2 {
		@apply my-3 pl-3 font-sans text-2xl font-bold text-white;
	}
	p {
		@apply font-sans font-normal text-white;
	}
	button {
		@apply h-9 rounded-md border-l border-r border-[#3f3f3f] border-t-[#242424] bg-[#363636] px-5 align-middle font-sans text-base text-white shadow-[0_2px_5px_-2px_rgba(0,0,0,0.67)] transition-all duration-100;
	}
	button:hover {
		@apply border-[#4e4e4e] bg-[#3f3f3f] shadow-[0_2px_5px_-2px_rgba(0,0,0,1)];
	}
</style>
