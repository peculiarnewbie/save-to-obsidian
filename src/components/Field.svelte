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
  
<div class="FieldRoot">
    <!-- <p>{index}</p> -->
    <input style="width: 100%; font-weight:700; font-size:16px" type="text" placeholder="enter key" bind:value={key}>
    <div style="padding-left: 20px">
        <div class="FieldComponent">
        </div>
        <div style="display: flex; justify-content:space-between">
            <div class="FieldComponent">
                <input type="text" placeholder="select data or type here" bind:value={value}>
            </div>
            <button on:click={selectElement}>Select Data</button>
        </div>

    </div>
</div>
  
<style>
.FieldRoot{
    padding: 0 10px 0 0;
    margin: 10px 0;
}
h4{
    margin: 10px 0px 5px 5px;
}
input{
    width: 100%;
    min-width: 40px;
    height: 2rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #3e4446;
    padding: 0 0 0 10px;
}
.divider{
    width: 100%;
    height: 2px;
    background-color: #3e4446;
}
.FieldComponent{
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 5px 0 0 0;
}
p{
    margin: 5px 0;
}
button{
    padding: 0.5rem 1rem;
    font-weight: 200;
}
</style>