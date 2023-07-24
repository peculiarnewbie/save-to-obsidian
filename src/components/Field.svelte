<script lang="ts">
    import select from '../../public/Select.svg'
    import trash from '../../public/Delete.svg'
    import "../app.css"
    import { createEventDispatcher } from "svelte";
    export let index = 0;
    export let field;
    $: key = field.key;
    $: value = field.value;
    $: treePath = field.treePath;
    export let parentInspect;
    export let isEditing = false;

    enum IdType {
        ID,
        CLASS,
        INDEX
    }
    
    const dispatch = createEventDispatcher()

    const initField = () => {
        if(field.treePath){
            determineNodeType(getElementFromPath(field.treePath))
        }
    }

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

        field.treePath = path.reverse()
        console.log("treePath: ", field.treePath)

        getElementFromPath(field.treePath, selectedElement)

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

    const getElementFromPath = (path, selectedElement?) => {
        let currentElement;

        currentElement = getElementFromCurrentPath(path[0], document.body)
        
        for(let i = 1; i < path.length; i++){
            currentElement = getElementFromCurrentPath(path[i], currentElement)
        }

        if(selectedElement == undefined){
            return currentElement
        }
        if(currentElement != selectedElement){
            console.error("failed to generate path")
        }
    }

    const getElementFromCurrentPath = (currentPath, currentElement) => {
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
            field.value = selectedElement.src;
        }
        else{
            console.log("innerText: ", selectedElement.innerText)
            field.value = selectedElement.innerText;
        }
    }

    const deleteField = () => {
        dispatch("deleteField", index)
    }

    initField()
</script>
  
<div id="FieldRoot" class="pt-3">
    <!-- <p>{index}</p> -->
    {#if isEditing}
    <input class="font-bold text-base text-white w-full min-w-[40px] h-8 bg-transparent outline-none border-b border-[#3e4446]" 
        type="text" placeholder="enter key" bind:value={field.key}>
    <div id="FieldComponent" class="flex gap-1 align-middle pt-1">
        
        <button class="p-2 pb-1 rounded-md bg-transparent hover:bg-[#363636]"
         on:click={selectElement}>
            {#if import.meta.env.DEV}
            <img src={select} alt="select" width="15px">
            {:else}
            <img src={chrome.runtime.getURL(select)} alt="select" width="15px">
            {/if}
        </button>
        <input class=" font-normal text-base text-white w-full min-w-[40px] h-8 bg-transparent outline-none border-b border-[#3e4446]"
            type="text" placeholder="select data or type here" bind:value={field.value}>
        
    </div>
    <button class="p-2 rounded-md bg-transparent hover:bg-[#363636]"
    on:click={deleteField}>
        {#if import.meta.env.DEV}
        <img src={trash} alt="select" width="15px">
        {:else}
        <img src={chrome.runtime.getURL(trash)} alt="select" width="15px">
        {/if}
    </button>
    {:else}
        <div id="FieldComponent" class="flex gap-1 align-middle pt-1">
            <p style="font-weight:700; font-size:16px">{key}</p>
            <p>{value}</p>
        </div>
    {/if}
</div>
  
<style>
   
</style>