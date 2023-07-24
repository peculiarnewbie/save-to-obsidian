<script lang="ts">
    export let selectedElement;
    $: currentElement = selectedElement;
    let treePath;

    enum IdType {
        ID,
        CLASS,
        INDEX
    }

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

    const getParentElement = () => {
        if(currentElement.parentElement){
            selectedElement = currentElement.parentElement;
        } else {
            return currentElement
        }
    }

    const FinishSelection = () => {
        generatePath()
        chrome.runtime.sendMessage({ action: "elementSelected", path: treePath}, (response) => {})
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
    
    const determineNodeType = (selectedElement) => {
        if(selectedElement.nodeName == "IMG"){
            console.log("src: ", selectedElement.src)
            return selectedElement.src;
        }
        else{
            console.log("innerText: ", selectedElement.innerText)
            return selectedElement.innerText;
        }
    }

</script>

<div>
    {#if selectedElement}
        <button on:click={getParentElement}>Select Parent</button>
        <button on:click={FinishSelection}>Done</button>
    {/if}
</div>