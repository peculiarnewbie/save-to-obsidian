<script lang="ts">
    import select from '../../public/Select.svg'
    import trash from '../../public/Delete.svg'
    import { createEventDispatcher } from "svelte";
    export let index = 0;
    export let key = "key"
    export let value = "value"
    export let treePath = []
    export let parentInspect;

    enum IdType {
        ID,
        CLASS,
        INDEX
    }
    
    const dispatch = createEventDispatcher()

    const selectElement = async () => {
        const selectedElement = await parentInspect();
        generatePath(selectedElement)
        determineNodeType(selectedElement)
    }

    const generatePath = (selectedElement) => {
        let path = []
        let currentElement = selectedElement;
        let searchResult = {found: false, index: 0};
        
        while(currentElement != document.body){
            if(currentElement.id != ""){
                path.push({type: IdType.ID, value: currentElement.id, index: 0})
                break
            }
            else if(currentElement.className != ""){
                if(validateClass(currentElement.className)){
                    let queriedElements = document.getElementsByClassName(currentElement.className)
                    if(queriedElements.length < 5){
                        searchResult = searchElements(queriedElements, currentElement)
                        path.push({type: IdType.CLASS, value: currentElement.className, index: searchResult.index})
                        break
                    }
                }
            }

            path.push({type: IdType.INDEX, value: "", index: Array.from(currentElement.parentElement.children).indexOf(currentElement)})
            currentElement = currentElement.parentElement
            continue
        }

        treePath = path.reverse()
        console.log("treePath: ", treePath)

        testPath(treePath, selectedElement)

    }

    const validateClass = (className) => {
        if(className.includes(" ")){
            return false;
        }
        else if(className.length > 40){
            return false;
        }
        else {
            let regex = /\d/;
            if(regex.test(className)){
                return false;
            }
            else{
                return true;
            }
        }

    }

    const testPath = (path, selectedElement) => {
        let currentElement;

        currentElement = getElementFromPath(path[0], document.body)
        
        for(let i = 1; i < path.length; i++){
            console.log("currentElement: ", currentElement)
            currentElement = getElementFromPath(path[i], currentElement)
        }

        if(currentElement != selectedElement){
            console.error("failed to generate path")
        }
    }

    const getElementFromPath = (currentPath, currentElement) => {
        switch(currentPath.type){
            case IdType.ID:
                return currentElement.querySelector("#" + currentPath.value)
            case IdType.CLASS:
                return currentElement.querySelectorAll("." + currentPath.value)[currentPath.index]
            case IdType.INDEX:
                return currentElement.children[currentPath.index]
        }
    }

    const searchElements = (elements, element) => {
        for(let i = 0; i < elements.length; i++){
            if(elements[i] == element){
                return {found: true, index: i}
            }
        }
        console.error("failed to find element")
        return {found: false, index: 0}
    }
    
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

    const deleteField = () => {
        dispatch("deleteField", index)
    }
</script>
  
<div class="FieldRoot">
    <!-- <p>{index}</p> -->
    <input style="font-weight:700; font-size:16px" type="text" placeholder="enter key" bind:value={key}>
    <div class="FieldComponent">
        
        <button on:click={selectElement}>
            {#if import.meta.env.DEV}
            <img src={select} alt="select" width="15px">
            {:else}
            <img src={chrome.runtime.getURL(select)} alt="select" width="15px">
            {/if}
        </button>
        <input type="text" placeholder="select data or type here" bind:value={value}>
        
    </div>
    <button on:click={deleteField}>
        {#if import.meta.env.DEV}
        <img src={trash} alt="select" width="15px">
        {:else}
        <img src={chrome.runtime.getURL(trash)} alt="select" width="15px">
        {/if}
    </button>
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