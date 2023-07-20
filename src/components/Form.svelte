<script lang="ts">
    import Field from "./Field.svelte";
    export let root: HTMLElement;

    export let fields = [{key: "", data: ""}]
    export let openForm = true;
    let hoveredElement;
    $: data = `---<br>${
        fields.map(field => {
            return `${field.key}: ${field.data}`
        }).join('<br>')
    }<br>---<br>`

    const download = () => {
        data = `---\n` 
        fields.forEach((field) => {
        data += `${field.key}: ${field.data}\n`
        })
        data += `---\n`
        console.log("clicked download")
        chrome.runtime.sendMessage({ action: "download", data: data}, (response) => {
            console.log("sent message")
            if (response.success) {
                console.log("success")
                document.getElementById("floatingPage").style.display = "none";
            }
            console.log("done")
        })
    }

    const addField = () => {
        fields = [...fields, {key: "", data: ""}]
    }

    function deleteField(event){
        const temp = [...fields]
        temp.splice(event.detail, 1)
        fields = temp;
    }

    const inspect = async () => {

        let selectedElement;

        root.style.opacity = "0";
        root.style.pointerEvents = "none";

        let click_count = 0;

        const canvas = document.getElementById("hoverCanvas") as HTMLCanvasElement;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";

        const ctx = canvas.getContext('2d');

        document.addEventListener('click', InspectElement, true);
        document.addEventListener('mouseover', HoverElement, true);
        window.addEventListener('mouseout', ClearCanvas, true);

        const WaitForSelection = () => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
            if (selectedElement) {
                clearInterval(interval);
                resolve(selectedElement);
            }
            }, 100);
        });
        };

        const chosen = await WaitForSelection() as HTMLElement;
        const getParent = (element) => {
            if(element.parentElement == null){
                console.log("no parent")
                return;
            }
            else{
            console.log("parent: ", element.parentElement)
            getParent(element.parentElement)
            }
        }
        getParent(chosen)
        return chosen

        function InspectElement (event) {
        console.log(click_count)
        click_count++;
        event.preventDefault();
        event.stopPropagation();
        const element = event.target;
        selectedElement = element;

        if(click_count == 1){
            root.style.opacity = "1";
            root.style.pointerEvents = "all";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.removeEventListener('click', InspectElement, true);
            document.removeEventListener('mouseover', HoverElement, true);
            window.removeEventListener('mouseout', ClearCanvas, true);
            return selectedElement
        }
        }

        function HoverElement (event){
        console.log("hovered")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hoveredElement = event.target;
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        const hoveredDom = hoveredElement.getBoundingClientRect();
        // ctx.fillRect(100, 100, 200, 200);
        ctx.fillRect(hoveredDom.left, hoveredDom.top, hoveredDom.width, hoveredDom.height);
        }

        function ClearCanvas (){
        // console.log("mouseout")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
</script>


<div class="Form">
    <div>
        <button on:click={() =>{openForm = false}}>Back</button>
        <button on:click={addField}>Add Field</button>
        <!-- <button on:click={getParent}>Prev</button>
        <button on:click={inspect}>Inspect</button> -->
    </div>
        
    {#each fields as field, i}
    <Field index={i} bind:key={field.key} bind:value={field.data} parentInspect={inspect} on:deleteField={deleteField} />
    {/each}
</div>
  
<div class="result">
    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; align-items:end">
    <p style="margin: 0;">result:</p>
    <button on:click={download}>Download</button>
    </div>
    <div class="rawData">
    <p style="margin: 0;">{@html data}</p>
    </div>
</div>


<style>
.Form{
  min-height: 100px;
  flex-grow: 10;
  padding: 15px;
  overflow-y: auto;
}
.result{
  display: flex;
  flex-direction: column;
  height: 176px;
  width: auto;
  background-color: #1e1e1e;
  padding: 10px;
  /* box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.25); */
  border-top: #363636 solid 1px;
}
.rawData{
  height: 50%;
  flex-grow: 10;
  overflow-y: auto;
  background-color: #242424;
  padding: 8px;
  font-size: 12px
}
button {
  align-items: center;
  border-radius: 6px;
  border: 1px solid transparent;
  padding: 0.4em 1.5em;
  height: 36px;
  font-size: 1em;
  font-weight: 300;
  font-family: inherit;
  background-color: #363636;
  cursor: pointer;
  transition: border-color 0.1s;
  border-left: solid 1px #3f3f3f;
  border-right: solid 1px #3f3f3f;
  border-top: solid 1px #484848;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.67);
}
button:hover {
  background-color: #3f3f3f;
  border-left: solid 1px #4e4e4e;
  border-right: solid 1px #4e4e4e;
  border-top: solid 1px #5b5b5b;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 1);
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>