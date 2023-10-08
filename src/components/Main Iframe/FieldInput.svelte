<script lang="ts">
	import sanitizeString from "../../utils/SanitizeString";
	import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import DatePicker from "../DatePicker.svelte";
	import { onMount, tick } from "svelte";
	import TextInput from "../TextInput.svelte";

	export let field;
	export let valueFocus: boolean = false;
	export let menuTarget: HTMLElement = null;

	let errorMessage = "";
	let validInput = true;

	let isPlaceholder = false;

	$: {
		if (field.type == InputEnum.Filename) {
			field.value = sanitizeString(field.value);
		}
	}

	let datePicker;

	const checkNameValidity = (event: Event) => {
		const target = event.target as HTMLInputElement;

		var rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
		var rg2 = /^\./; // cannot start with dot (.)
		var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
		if (target.value == "") {
			validInput = false;
			errorMessage = "Cannot be empty";
		} else if (!rg1.test(target.value)) {
			let lastChar = target.value[target.value.length - 1];
			target.value = field.value;
			validInput = false;
			errorMessage = "Invalid character: " + lastChar;
		} else if (rg2.test(target.value)) {
			target.value = field.value;
			validInput = false;
			errorMessage = "Cannot start with dot";
		} else if (rg3.test(target.value)) {
			validInput = false;
			errorMessage = "Invalid name";
		} else {
			validInput = true;
			errorMessage = "";
		}
	};
</script>

{#if field.type == InputEnum.Filename}
	<input
		class=" font-normal text-small text-white h-7 bg-transparent outline-none w-full p-1"
		type="text"
		placeholder="select data or type here"
		on:input={checkNameValidity}
		on:focus={() => {
			valueFocus = true;
		}}
		on:blur={(e) => {
			checkNameValidity(e);
			valueFocus = false;
		}}
		bind:value={field.value}
	/>
{:else if field.type == InputEnum.Text}
	<TextInput
		bind:inputValue={field.value}
		placeholder="No Value"
		bind:valueFocus
	/>
	<!-- <p class="break-all whitespace-pre-wrap">{field.value}</p> -->
{:else if field.type == InputEnum.Date}
	<div bind:this={datePicker}>
		<DatePicker bind:field bind:menuTarget bind:isEditing={valueFocus} />
	</div>
{/if}

{#if !validInput}
	<div
		class="absolute bg-red-500 w-fit h-fit right-1/2 translate-x-1/2 top-0 p-1 px-4 rounded-md"
	>
		<p class="text-white font-medium">{errorMessage}</p>
	</div>
{/if}
