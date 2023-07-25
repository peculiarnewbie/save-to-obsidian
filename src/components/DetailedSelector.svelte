<script lang="ts">
    export let extensionId;
    export let selectedElement;
    $: currentElement = selectedElement;
    let treePath;

    enum IdType {
        ID,
        CLASS,
        INDEX
    }

    if(!import.meta.env.DEV){
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.action == "bgGetElement"){
                const value = getElementValueFromPath(request.path)
                if(value){
                    sendResponse({success:true, value: value})
                }
                else{
                    sendResponse({success:false})
                }
            }
        })
    }

    const getParentElement = () => {
        if(currentElement.parentElement){
            selectedElement = currentElement.parentElement;
        } else {
            return currentElement
        }
    }

    const FinishSelection = () => {
        generatePath()
        chrome.runtime.sendMessage({ action: "elementSelected", path: treePath})
        selectedElement = null;
    }

    const generatePath = () => {
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

    const getElementValueFromPath = (path, selectedElement?) => {
        let element;
        console.log("in detail: getting element from: ", path);
        element = getElementFromCurrentPath(path[0], document.body)
        console.log("in detail: first path: ", element)
        
        for(let i = 1; i < path.length; i++){
            element = getElementFromCurrentPath(path[i], element)
        }

        if(!selectedElement){
            return determineNodeType(element)
        }
        if(element != selectedElement){
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
    
    const determineNodeType = (element) => {
        if(element.nodeName == "IMG"){
            console.log("src: ", element.src)
            return element.src;
        }
        else{
            console.log("innerText: ", element.innerText)
            return element.innerText;
        }
    }

    const buttonStyle = `
        background-color: #363636;
        color: white;
        border-top: 1px solid #242424;
        border-left: 1px solid #3f3f3f;
        border-right: 1px solid #3f3f3f;
        box-shadow: 0 2px 5px -2px rgba(0,0,0,0.67);
        border-radius: 6px;
        padding: 0 20px 0 20px;
        align-items: center;
        height: 20px;
    `

    const rootStyle = `
        all:initial; 
        display:flex; 
        background-color: #242424; 
        border-radius: 6px; 
    `

    const parentStyle = `
        padding: 8px
    `

</script>

<div style={`${rootStyle}`}>
    <div style={`${parentStyle}`}>
        {#if selectedElement}
        <button style={`all:initial; ${buttonStyle}`} on:click={getParentElement}>Select Parent</button>
        <button style={`all:initial; ${buttonStyle}`}  on:click={FinishSelection}>Done</button>
        {/if}
    </div>
</div>

<style>
    /* button{
        background-color: #363636;
        color: white;
        border-top: 1px solid #242424;
        border-left: 1px solid #3f3f3f;
        border-right: 1px solid #3f3f3f;
        box-shadow: 0 2px 5px -2px rgba(0,0,0,0.67);
        border-radius: 6px;
        padding: 0 5px 0 5px;
        align-items: center;
    } */
</style>