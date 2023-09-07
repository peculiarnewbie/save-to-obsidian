<script lang="ts">
	import { formTopLimit, formBottomLimit, mainIframeDoc } from "../../utils/stores";
	import { get } from "svelte/store";
	import StickyModals from "../StickyModals.svelte";
    import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import { onDestroy, onMount } from "svelte";

    export let changingType = false;
    export let menuTarget;
    export let field;

    let typeMenu
    let doc = $mainIframeDoc

    let topLimit = get(formTopLimit);
    let bottomLimit = get(formBottomLimit);

    const changeFieldType = (type) => {
        field.type = type
        changingType = false
    }

</script>

<StickyModals needToFlip={false} {topLimit} {bottomLimit} yOffset={0} xOffset={0} menuTarget={menuTarget} clickOffDoc={doc} bind:isActive={changingType}>
    <div bind:this={typeMenu} class="flex flex-col font-normal text-base text-left shadow-lg text-white w-fit min-w-[40px] bg-[#363636] outline-none rounded-md p-2">
        <button class="text-left hover:bg-[#4e4e4e] w-full flex p-1 rounded-md justify-between gap-3 items-center h-7">
            <div class="flex gap-2 items-center">
                <div class=" h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-full h-full"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </div>
                <p>Property type</p>
            </div>
            
            <div class=" h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right w-full h-full"><path d="m9 18 6-6-6-6"/></svg>
            </div>
        </button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Text)}>Text</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.List)}>List</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.MultiList)}>MultiList</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Date)}>Date</button>
    </div>
</StickyModals>