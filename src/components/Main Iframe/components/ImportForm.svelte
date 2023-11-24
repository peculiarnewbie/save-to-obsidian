<script lang="ts">
	import TextInput from "../../TextInput.svelte";

	export let importForms: (input: string) => void;
	let isOpen = false;
	let importInput = "";

	const handleImport = () => {
		importForms(importInput);
	};
</script>

<button
	on:click={() => {
		isOpen = !isOpen;
	}}
	class="btn w-44">{`${isOpen ? "Cancel" : "Import Form"}`}</button
>
{#if isOpen}
	<div class="max-w-[26srem] grow text-white">
		<TextInput
			bind:inputValue={importInput}
			placeholder="paste text from your exported json"
			hasOutline={true}
		/>
		<button on:click={handleImport} class="btn mt-2">Import</button>
		<p>
			{"Be careful, it is recommended to export the current forms before importing a new one"}
		</p>
	</div>
{/if}
