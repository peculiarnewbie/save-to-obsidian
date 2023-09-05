<script lang="ts">
    import sanitizeString from "../../utils/SanitizeString";
    import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import DatePicker from "../DatePicker.svelte";
	import { onMount, tick } from "svelte";
    export let field;
	export let valueFocus;
	export let menuTarget: HTMLElement = null;
    
    let errorMessage = "";
    let validInput = true;

    $: {
		if(field.type == InputEnum.Filename){
			field.value = sanitizeString(field.value);
		}
	}

	let datePicker;

    const checkNameValidity = (event: Event) => {
		const target = event.target as HTMLInputElement;

		var rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
		var rg2 = /^\./; // cannot start with dot (.)
		var rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
		if(target.value == ""){
			validInput = false;
			errorMessage = "Cannot be empty";
		}
		else if(!rg1.test(target.value)){
			let lastChar = target.value[target.value.length - 1];
			target.value = field.value;
			validInput = false;
			errorMessage = "Invalid character: " + lastChar;
		}
		else if(rg2.test(target.value)){
			target.value = field.value;
			validInput = false;
			errorMessage = "Cannot start with dot";
		}
		else if(rg3.test(target.value)){
			validInput = false;
			errorMessage = "Invalid name";
		}
		else{
			validInput = true;
			errorMessage = "";
		}
	}

</script>

{#if field.type == InputEnum.Filename}
<input
    class=" font-normal text-small text-white h-7 bg-transparent outline-none "
    type="text"
    placeholder="select data or type here"
    on:input={checkNameValidity}
    on:blur={checkNameValidity}
    bind:value={field.value}
/>
{:else if field.type == InputEnum.Text}
<input
    class=" font-normal text-small text-white bg-transparent w-12 grow h-auto pl-2 outline-none overflow-visible"
    placeholder="select data or type here"
    bind:value={field.value}
	on:focus={() => {valueFocus = true}}
	on:blur={() => {valueFocus = false}}
/>
{:else if field.type == InputEnum.Date}
	<div bind:this={datePicker}>
		<DatePicker bind:field={field} bind:menuTarget={menuTarget} />
	</div>
{/if}

{#if !validInput}
    <p class="text-red-500">{errorMessage}</p>
{/if}