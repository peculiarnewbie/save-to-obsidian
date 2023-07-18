<script lang="ts">
    import select from '../../public/Select.svg'
    import trash from '../../public/Delete.svg'
    import { createEventDispatcher } from "svelte";
    export let index = 0;
    export let key = "key"
    export let value = "value"
    export let parentInspect;
    
    const dispatch = createEventDispatcher()

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

    const deleteField = () => {
        dispatch("deleteField", index)
    }
</script>
  
<div class="FieldRoot">
    <!-- <p>{index}</p> -->
    <input style="font-weight:700; font-size:16px" type="text" placeholder="enter key" bind:value={key}>
    <div class="FieldComponent">
        
        <button on:click={selectElement}><img src={select} alt="select" width="15px"></button>
        <input type="text" placeholder="select data or type here" bind:value={value}>
        
    </div>
    <button on:click={deleteField}><img src={trash} alt="select" width="15px"></button>
</div>
  
<style>
.FieldRoot{
    padding: 0 10px 0 0;
    margin: 10px 0;
}
/* h4{
    margin: 10px 0px 5px 5px;
} */
input{
    width: 100%;
    min-width: 40px;
    height: 2rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #3e4446;
    padding: 0 0 0;
}
/* .divider{
    width: 100%;
    height: 2px;
    background-color: #3e4446;
} */
.FieldComponent{
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px 0 0 0px;
}
/* p{
    margin: 5px 0;
} */
button{
    padding: 7px 7px 3px 7px;
    font-weight: 200;
    border: none;
    border-radius: 5px;
    background-color: transparent;
}
button:hover{
    background-color: #363636;
    color: white;
}
</style>