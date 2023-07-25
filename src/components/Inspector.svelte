<script lang="ts">
    import DetailedSelector from "./DetailedSelector.svelte";

    export let canvas: HTMLCanvasElement;
    export let extensionId;
    let selectedElement;

    let hoveredElement;

    enum IdType {
        ID,
        CLASS,
        INDEX
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.action === "closePopup"){
            const popup = document.getElementById(`${extensionId}-iframe`)
            popup.remove()
            sendResponse({success: true})
        }
        else if(request.action === "inspect"){
            inspect()
            sendResponse({success: true})
        }
        else if(request.action === "bgValuesUpdate"){
            console.log("in inspector: got bgValuesUpdate", request.paths)
            let values = []
            request.paths.forEach((path, index) => {
                values.push(getElementValueFromPath(path))
            })
            sendResponse({success: true, values: values})
        }
    })

    const inspect = async () => {

        let click_count = 0;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";

        const ctx = canvas.getContext('2d');

        document.addEventListener('click', InspectElement, true);
        document.addEventListener('mouseover', HoverElement, true);
        window.addEventListener('mouseout', ClearCanvas, true);

        function InspectElement (event) {
            click_count++;
            event.preventDefault();
            event.stopPropagation();
            const element = event.target;
            selectedElement = element;

            if(click_count == 1){
                console.log(selectedElement)
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.removeEventListener('click', InspectElement, true);
                document.removeEventListener('mouseover', HoverElement, true);
                window.removeEventListener('mouseout', ClearCanvas, true);
            }
        }

        function HoverElement (event){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hoveredElement = event.target;
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        const hoveredDom = hoveredElement.getBoundingClientRect();
        // ctx.fillRect(100, 100, 200, 200);
        ctx.fillRect(hoveredDom.left, hoveredDom.top, hoveredDom.width, hoveredDom.height);
        }

        function ClearCanvas (){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getElementValueFromPath = (path) => {

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

        let element;
        console.log("in detail: getting element from: ", path);
        element = getElementFromCurrentPath(path[0], document.body)
        console.log("in detail: first path: ", element)

        for(let i = 1; i < path.length; i++){
            element = getElementFromCurrentPath(path[i], element)
        }

        return determineElementValue(element)


    }

    const determineElementValue = (element) => {
        if(element.nodeName == "IMG"){
            return element.src
        }
        else{
            return element.innerText
        }
    }

</script>

{#if selectedElement}
<div>
    <DetailedSelector extensionId={extensionId} bind:selectedElement={selectedElement} getElementValueFromPath={getElementValueFromPath} />
</div>
{/if}