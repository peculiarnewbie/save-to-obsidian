<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let index = 0;
    export let key = "key"
    export let value = "value"
    export let parentInspect;

    const selectElement = async () => {
        const selectedElement = await parentInspect();

        console.log("from child: ", selectedElement)

        const determineNodeType = (selectedElement) => {
            if(selectedElement.nodeName == "IMG"){
                console.log("src: ", selectedElement.src)
                value = selectedElement.src
            }
            else{
                console.log("innerText: ", selectedElement.innerText)
                value = selectedElement.innerText;
            }
        }

        determineNodeType(selectedElement)
    }
</script>
  
<div>
    <!-- <p>{index}</p> -->
    <input type="text" placeholder="enter key" bind:value={key}>
    <p>value: {value}</p>
    <button on:click={selectElement}>Inspect</button>
</div>
  
<style>
/* Child component styles */
</style>