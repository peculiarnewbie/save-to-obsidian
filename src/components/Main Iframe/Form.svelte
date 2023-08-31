<script lang="ts">
	import { onMount } from "svelte";
	import Field from "./Field.svelte";
	import {formBottomLimit, formScroll, formTopLimit, storeMessaging, Actions} from "../../utils/stores"

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
	let validDir = true;
	let formElement: HTMLElement;
	let resultElement: HTMLElement;

	if(directory == ""){
		currentForm.directory = "Obsidian/";
	}

	$: fullTitle =
		function(){
			let lastChar = directory.charAt(directory.length - 1);
			if(lastChar == '/' || lastChar == '\\' || directory == ""){
				return directory;
			} else {
				return directory + '/';
			}}() 
		+ currentForm.fields[0].value + ".md";

	storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data;
		switch(action){
			case Actions.ElementSelected:
				currentForm.fields[selectionIndex].treePath = data.path;
				currentForm.fields[selectionIndex].value = data.value;
				break;
			case Actions.ValueUpdated:
				data.values.forEach((value, index) => {
					currentForm.fields[index].value = value;
				})
				break;
			default:
				break;
		}
	})

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
					chrome.runtime.sendMessage({ message: "closeExtension" });
				}
			},
		);
	};

	const addField = () => {
		currentForm.fields = [...currentForm.fields, { key: "", value: "", type: "text" }];
	};

	function deleteField(event) {
		let temps = [...currentForm.fields];
		temps.splice(event.detail.index, 1);
		currentForm.fields = temps;
	}

	const inspect = async (index) => {
		selectionIndex = index;
		storeMessaging.set({action: Actions.StartInspect})
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

		storeMessaging.set({action: Actions.CollectValues, data: {paths: paths}})
	};

	storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data
		switch(action){
			case Actions.ValuesCollected:
				data.values.forEach((value, index) => {
					if(!value) return;
					currentForm.fields[index].value = value;
				})
				break;
			default:
				break;
		}
	})

	prevName = currentForm.name;

	if (!isEditing) {
		updateFieldValues();
	}

	const checkDirValidity = (event: Event) => {
		validDir = true;
		const target = event.target as HTMLInputElement;
		
		if(target.value == "") {
			return
		}
		else{
			var rg1 = /^(?:[a-z]:)?[\/\\]{0,2}(?:[.\/\\ ](?![.\/\\\n])|[^<>:"|?*.\/\\ \n])+$/i;
			if(!rg1.test(target.value)){
				target.value = directory;
				validDir = false;
			}
		}
	}

	const handleScroll = (e) => {
		formScroll.set((e.target as HTMLElement).scrollTop);
	}

	onMount(() => {
		formElement.addEventListener("wheel", function(e){
			formElement.scrollTop += e.deltaY;
		})

		formTopLimit.set(formElement.getBoundingClientRect().top);
		formBottomLimit.set(resultElement.getBoundingClientRect().bottom);

	})

</script>

<div on:scroll={handleScroll} id="Form" bind:this={formElement} class="pt-1 min-h-28 p-4 overflow-y-auto flex-grow-[10] font-sans font-normal text-white">
	{#if isEditing}
		<div style="display: flex; justify-content:space-between; align-items:end">
			<div>
				<p class="text-xl font-semibold">Form Title:</p>
				<input
					class="text-black"
					type="text"
					placeholder="enter form name"
					bind:value={currentForm.name}
				/>
			</div>
			<div>
				<p class="text-xl font-semibold">Directory:</p>
				<div class="relative">
					<input class={`${validDir ? "" : "outline-red-500"} text-black`}
						type="text"
						placeholder="enter directory"
						on:input={checkDirValidity}
						on:blur={checkDirValidity}
						bind:value={currentForm.directory}
					/>
					{#if !validDir}
						<div class="absolute">
							<p class=" text-red-500">invalid path</p>
						</div>
					{/if}

				</div>
			</div>
			<button class="btn" on:click={addField}>Add Field</button>
		</div>
	{:else}
		<button
			class="btn"
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
	class="flex flex-col text-white h-48 bg-[#1e1e1e] p-3 pb-5 border-t border-[#363636] bottom-0 font-sans font-normal"
	bind:this={resultElement}
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
			<button class="btn" on:click={saveForm}>Save</button>
		{:else}
			<button class="btn" on:click={download}>Download</button>
		{/if}
	</div>
</div>

<style>
</style>
