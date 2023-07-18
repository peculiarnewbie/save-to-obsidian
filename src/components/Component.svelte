
<script lang="ts">
    import Field from "./Field.svelte";

  export let root: HTMLElement;

  let fields = [{key: "key", data: "click inspect or type here"}]
  let hoveredElement;
  let data = ""

  const closePopup = () => {
    root.remove();
  };

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
    fields = [...fields, {key: "key", data: "click inspect or type here"}]
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

    const chosen = await WaitForSelection();
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

  // const getParent = () => {
  //   console.log("element: ", selectedElement)
  //   console.log("parent: ", selectedElement.parentElement)
  //   if(selectedElement.parentElement == null){
  //     console.log("no parent")
  //     return;
  //   }
  //   else{
  //     selectedElement = selectedElement.parentElement
  //     return selectedElement
  //   }
  // }

  // const determineNodeType = () => {
  //   if(selectedElement.nodeName == "IMG"){
  //     console.log("src: ", selectedElement.src)
  //     data = selectedElement.src
  //     return data
  //   }
  //   else{
  //     console.log("innerText: ", selectedElement.innerText)
  //     data = selectedElement.innerText;
  //     return data
  //     console.log(JSON.stringify(fields))
  //   }
  // }

</script>

<div class="ActualRoot">
  <h1>Markdown Clipper</h1>
    <button on:click={closePopup}>Close</button>
  <div>
    <p class="rawData">{JSON.stringify(fields)}</p>
    <button on:click={addField}>Add Field</button>
    <!-- <button on:click={getParent}>Prev</button>
    <button on:click={inspect}>Inspect</button> -->
  </div>

  {#each fields as field, i}
    <Field index={i} bind:key={field.key} bind:value={field.data} parentInspect={inspect} />
  {/each}

  <button on:click={download}>Download</button>
</div>

<style>
.ActualRoot{
  background-color: white;
  padding: 15px;
  margin: 10px;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
.rawData{
  width: 200px;
  height: auto;
}
</style>
