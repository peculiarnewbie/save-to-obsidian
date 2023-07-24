<script lang="ts">
    import DetailedSelector from "./DetailedSelector.svelte";

    export let root: HTMLElement;
    export let canvas: HTMLCanvasElement;
    let selectedElement;

    let hoveredElement;

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

        // const WaitForSelection = () => {
        // return new Promise((resolve, reject) => {
        //     const interval = setInterval(() => {
        //     if (selectedElement) {
        //         clearInterval(interval);
        //         resolve(selectedElement);
        //     }
        //     }, 100);
        // });
        // };

        // const chosen = await WaitForSelection() as HTMLElement;

        // return chosen

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

    inspect();

</script>

<div>
    <DetailedSelector selectedElement={selectedElement} />
</div>