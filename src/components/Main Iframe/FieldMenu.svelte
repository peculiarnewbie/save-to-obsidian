<script lang="ts">
	import { formTopLimit, formBottomLimit, mainIframeDoc } from "../../utils/stores";
	import { get } from "svelte/store";
	import StickyModals from "../StickyModals.svelte";
    import { InputEnum, type FieldInputKeys } from "../../utils/FieldInputType";
	import { onMount } from "svelte";

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
    <div bind:this={typeMenu} class="flex flex-col font-bold text-base shadow-lg text-white w-44 min-w-[40px] bg-[#363636] outline-none p-2 rounded-md">
        <button class="">ulala</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Text)}>Text</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.List)}>List</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.MultiList)}>MultiList</button>
        <button class="p-1 rounded-md hover:bg-[#4e4e4e] text-left" on:click={() => changeFieldType(InputEnum.Date)}>Date</button>
    </div>
</StickyModals>