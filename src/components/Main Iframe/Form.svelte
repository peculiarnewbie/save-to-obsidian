<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";
	import Field from "./Field.svelte";
	import {
		formBottomLimit,
		formScroll,
		formTopLimit,
		storeMessaging,
		Actions,
		fieldReordering,
		pauseScrolling,
	} from "../../utils/stores";
	import TextInput from "../TextInput.svelte";

	export let root: HTMLElement;
	export let currentForm;
	export let isEditing;
	let fields;
	let prevName;
	let hoveredElement;
	let isLoading = false;
	$: {
		let temp = [...currentForm.fields];
		temp.splice(0, 2);
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
	let menuTarget: HTMLElement;

	let extraContent: string = "Put extra notes here";

	if (directory == "") {
		currentForm.directory = "Obsidian/";
	}

	const waitATick = async (func) => {
		await tick();
		func();
	};

	const unsubscribe = storeMessaging.subscribe((message) => {
		const action = message.action;
		const data = message.data;
		console.log("message: ", message);
		switch (action) {
			case Actions.ElementSelected:
				console.log("in Form, element selected: ", message);
				currentForm.fields[selectionIndex].path = data.path;
				currentForm.fields[selectionIndex].value = data.value;
				storeMessaging.set({ action: Actions.OpenPopup });
				break;
			case Actions.ValuesCollected:
				if (data.values) {
					data.values.forEach((value, index) => {
						currentForm.fields[index].value = value;
					});
				}
				waitATick(() => {
					isLoading = false;
					console.log("back");
				});
				break;
			default:
				break;
		}
	});

	const download = () => {
		data = `---\n`;
		fields.forEach((field) => {
			data += `${field.key}: ${field.value}\n`;
		});
		data += `---\n`;
		data += currentForm.fields[1].value;

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
		let index = currentForm.fields.length;
		while (currentForm.fields.some((e) => e.key == `property ${index}`)) {
			index++;
		}
		currentForm.fields = [
			...currentForm.fields,
			{ key: `property ${index}`, value: "No Value", type: "text" },
		];
	};

	function deleteField(event) {
		let temps = [...currentForm.fields];
		temps.splice(event.detail.index, 1);
		currentForm.fields = temps;
	}

	const inspect = async (index) => {
		selectionIndex = index;
		storeMessaging.set({ action: Actions.StartInspect });
	};

	const saveForm = async () => {
		console.log("saving: ", currentForm);
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
		storeMessaging.set({
			action: Actions.CollectValues,
			data: {
				fields: currentForm.fields,
				fromBackground: currentForm.fromBackground,
			},
		});
		isLoading = true;
	};

	const checkDirValidity = (event: Event) => {
		validDir = true;
		const target = event.target as HTMLInputElement;

		if (target.value == "") {
			return;
		} else {
			var rg1 =
				/^(?:[a-z]:)?[\/\\]{0,2}(?:[.\/\\ ](?![.\/\\\n])|[^<>:"|?*.\/\\ \n])+$/i;
			if (!rg1.test(target.value)) {
				target.value = directory;
				validDir = false;
			}
		}
	};

	const reOrderField = (index: number, offset) => {
		// console.log("reorder: ", index, offset)
		fieldReordering.set(true);
		let temp = currentForm.fields;
		let newPos = index + offset;
		if (newPos < 1) newPos = 1;
		var element = temp[index];
		temp.splice(index, 1);
		temp.splice(newPos, 0, element);
		currentForm.fields = temp;
	};

	onMount(() => {
		formElement.addEventListener("wheel", function (e) {
			if ($pauseScrolling) return;
			formElement.scrollTop += e.deltaY;
			formScroll.set(formElement.scrollTop);
		});

		formTopLimit.set(formElement.getBoundingClientRect().top);
		formBottomLimit.set(resultElement.getBoundingClientRect().bottom);

		if (!isEditing) {
			updateFieldValues();
		}
	});

	onDestroy(unsubscribe);

	$: fullTitle =
		(function () {
			let lastChar = directory.charAt(directory.length - 1);
			if (lastChar == "/" || lastChar == "\\" || directory == "") {
				return directory;
			} else {
				return directory + "/";
			}
		})() +
		currentForm.fields[0].value +
		".md";

	prevName = currentForm.name;

	console.log("On Form: ", currentForm);
</script>

<div
	id="Form"
	bind:this={formElement}
	class="pt-1 min-h-28 p-4 overflow-y-auto overflow-x-hidden flex-grow-[10] font-sans font-normal text-white gap-[1px]"
>
	{#if isLoading}
		<div>{`loading...: ${isLoading}`}</div>
	{:else}
		{#if isEditing}
			<div
				class="flex-col"
				style="display: flex; justify-content:space-between;"
			>
				<div>
					<p class="text-xl font-semibold">Form Name:</p>
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
						<input
							class={`${validDir ? "" : "outline-red-500"} text-black`}
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

				<!-- <button
					class="btn"
					on:click={() => {
						currentForm.fromBackground = !currentForm.fromBackground;
					}}>{`fromBackground: ${currentForm.fromBackground}`}</button
				> -->
			</div>
		{:else}
			<button
				class="btn"
				on:click={() => {
					isEditing = true;
				}}>Edit</button
			>
		{/if}
		<div class="">
			<Field
				index={0}
				bind:field={currentForm.fields[0]}
				{reOrderField}
				parentInspect={inspect}
				{isEditing}
				length={currentForm.fields.length}
			/>
			{#each fields as field, i (field.key)}
				<Field
					index={i + 2}
					bind:field
					{reOrderField}
					parentInspect={inspect}
					on:deleteField={deleteField}
					{isEditing}
					length={currentForm.fields.length}
				/>
			{/each}
			<!-- <Field
				index={1}
				bind:field={currentForm.fields[1]}
				{reOrderField}
				parentInspect={inspect}
				{isEditing}
				length={currentForm.fields.length}
			/> -->
		</div>
		{#if isEditing}
			<button class="btn mt-2" on:click={addField}>Add Property</button>
		{/if}
		<div class="flex flex-col">
			<p class="font-semibold">Content:</p>
			<TextInput
				bind:inputValue={currentForm.fields[1].value}
				placeholder="Put extra notes here"
				hasOutline={true}
			/>
		</div>
		<div bind:this={menuTarget}></div>
	{/if}
</div>

<div
	id="result"
	class="flex flex-col text-white max-h-32 bg-[#1e1e1e] p-3 pb-5 border-t border-[#363636] bottom-0 font-sans font-normal"
	bind:this={resultElement}
>
	<!-- <div class="flex justify-between items-center mb-2">
		<p style="margin: 0;">result:</p>
	</div>
	<div
		id="rawData"
		class="h-full grow-10 overflow-y-auto bg-[#242424] p-2 text-xs"
	>
		<p style="margin: 0;">{@html data}</p>
	</div> -->
	<div class="flex justify-between mt-2 align-middle items-center">
		<div class="flex flex-col h-full overflow-y-auto">
			<div class="max-h-24">
				<p>full path:</p>
				<p>{fullTitle}</p>
			</div>
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
