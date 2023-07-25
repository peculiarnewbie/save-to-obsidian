<script lang="ts">
    import DetailedSelector from "./DetailedSelector.svelte";

    export let canvas: HTMLCanvasElement;
    export let extensionId;
    let selectedElement;

    let hoveredElement;

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

</script>

{#if selectedElement}
<div>
    <DetailedSelector extensionId={extensionId} bind:selectedElement={selectedElement} />
</div>
{/if}